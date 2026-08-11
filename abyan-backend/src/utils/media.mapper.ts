export class MediaMapper {
  /**
   * Extracts and unifies images from a database document, handling both new 'images' array and legacy 'image' string.
   * Ensures the return type is a clean string array.
   * @param item The database document (Mongoose lean document)
   */
  static extractImages(item: any): string[] {
    if (!item) return [];
    
    // If the new 'images' array exists and is not empty
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images.filter(Boolean);
    }
    
    // Fallback to legacy 'image' field
    if (item.image) {
      return [item.image];
    }
    
    return [];
  }
}
