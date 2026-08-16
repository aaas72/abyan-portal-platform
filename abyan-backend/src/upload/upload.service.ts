import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File, folderName?: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const folder = folderName ? `abyan-portal/${folderName}` : 'abyan-portal/general';

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(new BadRequestException('Failed to upload image'));
          }
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new BadRequestException('Failed to get secure URL from Cloudinary'));
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Renames a list of Cloudinary URLs to a standard format: {folder}/{elementName}_{elementId}_{type}_{index}
   * @param elementId The database ID of the element
   * @param elementName The human-readable name of the element (e.g. name of the pioneer)
   * @param urls The current Cloudinary URLs (from frontend upload)
   * @param folderName The target folder (e.g., 'pioneers')
   * @param type The file type (e.g., 'image', 'video', 'audio')
   * @returns Array of the new renamed Cloudinary URLs
   */
  async renameMediaUrls(
    elementId: string,
    elementName: string,
    urls: string[],
    folderName: string,
    type: 'image' | 'video' | 'audio' = 'image',
  ): Promise<string[]> {
    if (!urls || urls.length === 0) return [];

    const folder = `abyan-portal/${folderName}/${type}s`;
    const newUrls: string[] = [];
    const safeName = elementName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '');

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      // Check if it's a valid Cloudinary URL
      if (!url.includes('cloudinary.com')) {
        newUrls.push(url); // keep external links as is
        continue;
      }

      // Desired new public ID format
      const newPublicId = `${folder}/${safeName}_${elementId}_${type}_${i}`;

      // Extract the old public_id from the URL
      // A typical URL: https://res.cloudinary.com/<cloud>/image/upload/v12345/abyan-portal/pioneers/images/xxx.jpg
      const urlParts = url.split('/upload/');
      if (urlParts.length !== 2) {
        newUrls.push(url);
        continue;
      }

      // The part after /upload/ usually contains the version (v1234) and then the public_id + extension
      let pathAfterUpload = urlParts[1];

      // Remove version (e.g. v1700000000/) if exists
      if (pathAfterUpload.match(/^v\d+\//)) {
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
      }

      // Remove extension (e.g. .jpg) to get the clean public_id
      const lastDotIndex = pathAfterUpload.lastIndexOf('.');
      const rawOldPublicId = lastDotIndex !== -1 ? pathAfterUpload.substring(0, lastDotIndex) : pathAfterUpload;
      let decodedOldPublicId = rawOldPublicId;
      try {
        decodedOldPublicId = decodeURIComponent(rawOldPublicId);
      } catch (e) { }

      // If it is already named correctly, skip renaming to save API calls
      if (rawOldPublicId === newPublicId || decodedOldPublicId === newPublicId) {
        newUrls.push(url);
        continue;
      }

      try {
        // Cloudinary rename API call
        const result = await cloudinary.uploader.rename(decodedOldPublicId, newPublicId, {
          overwrite: true,
          invalidate: true,
        });

        if (result && result.secure_url) {
          newUrls.push(result.secure_url);
        } else {
          newUrls.push(url); // fallback
        }
      } catch (error) {
        console.error(`Failed to rename Cloudinary file from ${decodedOldPublicId} to ${newPublicId}:`, error);
        newUrls.push(url); // fallback to old URL if rename fails
      }
    }

    return newUrls;
  }

  /**
   * Deletes a file from Cloudinary given its secure URL.
   */
  async deleteMediaFromCloudinary(url: string, type: 'image' | 'video' | 'audio' = 'image'): Promise<void> {
    if (!url || !url.includes('cloudinary.com')) return;

    try {
      const urlParts = url.split('/upload/');
      if (urlParts.length !== 2) return;

      let pathAfterUpload = urlParts[1];
      if (pathAfterUpload.match(/^v\d+\//)) {
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
      }

      const lastDotIndex = pathAfterUpload.lastIndexOf('.');
      const publicId = lastDotIndex !== -1 ? pathAfterUpload.substring(0, lastDotIndex) : pathAfterUpload;

      const resourceType = type === 'image' ? 'image' : 'video'; // Cloudinary treats audio as 'video'

      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      console.error(`Failed to delete Cloudinary file: ${url}`, error);
    }
  }

  /**
   * Deletes multiple files from Cloudinary.
   */
  async deleteMultipleMedia(urls: string[], type: 'image' | 'video' | 'audio' = 'image'): Promise<void> {
    if (!urls || !Array.isArray(urls)) return;
    for (const url of urls) {
      await this.deleteMediaFromCloudinary(url, type);
    }
  }
}
