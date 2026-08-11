import { test, expect, Page } from '@playwright/test';

// Helper: Login as Admin
async function loginAsAdmin(page: Page) {
  await page.goto('/admin-login');
  await page.fill('input[type="email"]', 'admin@abyan.gov');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin-*', { timeout: 15000 });
}

// =========================================================
//  0. الدخول والتوثيق (Auth & Login Validation)
// =========================================================
test.describe('0. الدخول والتوثيق (Auth & Login Validation)', () => {
  test('التحقق من رفض تسجيل الدخول ببيانات خاطئة', async ({ page }) => {
    await page.goto('/admin-login');
    await page.fill('input[type="email"]', 'wrong@abyan.gov');
    await page.fill('input[type="password"]', 'WrongPassword!');
    await page.click('button[type="submit"]');
    await expect(page.locator('.text-red-500')).toBeVisible({ timeout: 10000 });
  });

  test('التحقق من تسجيل الدخول الناجح', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/.*admin-.*/);
  });
});

// =========================================================
//  1. المعرض والأرشيف (Gallery)
// =========================================================
test.describe('1. المعرض والأرشيف (Gallery)', () => {
  test('إضافة، تعديل، وحذف تصنيف أرشيفي', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-gallery', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'التصنيفات الأرشيفية' }).click();
    await page.getByRole('button', { name: 'إضافة تصنيف جديد' }).click();

    const title = `Test Gallery Cat ${Date.now()}`;
    await page.getByLabel(/العنوان الشارح/).fill(title);
    await page.getByLabel(/العنوان الفرعي/).fill('Test Subtitle');
    await page.locator('textarea').first().fill('Test description E2E');
    await page.getByLabel(/تصنيفات فرعية/).fill('E2E Tag');
    await page.getByLabel(/تصنيفات فرعية/).press('Enter');
    await page.locator('textarea').nth(1).fill('E2E paragraph.');
    await page.click('button:has-text("حفظ التصنيف")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/العنوان الشارح/).fill(updatedTitle);
    await page.click('button:has-text("حفظ التصنيف")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("تأكيد الحذف"), button:has-text("حذف التصنيف")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });

  test('إضافة ثم حذف وثيقة أرشيفية (Archive Item)', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-gallery', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'الوثائق الأرشيفية' }).click();
    await page.getByRole('button', { name: 'رفع وثيقة جديدة' }).click();

    const title = `Test Document ${Date.now()}`;
    await page.getByLabel(/عنوان الوثيقة/).fill(title);
    await page.getByLabel(/التصنيف/).fill('مخطوطات');
    await page.getByLabel(/موقع/).fill('خنفر');
    await page.getByLabel(/سنة/).fill('1985م');
    await page.locator('textarea').first().fill('E2E archive item description.');
    await page.click('button:has-text("حفظ الوثيقة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    const row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف الوثيقة"), button:has-text("حذف الصورة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});

// =========================================================
//  2. الرواد والشخصيات
// =========================================================
test.describe('2. الرواد والشخصيات (Pioneers)', () => {
  test('إضافة، تعديل، وحذف فئة رائد', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-pioneers', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'فئات الشخصيات' }).click();
    await page.getByRole('button', { name: 'إضافة فئة جديدة' }).click();

    const title = `Test Pioneer Cat ${Date.now()}`;
    await page.getByLabel(/العنوان الرئيسي/).fill(title);
    await page.getByLabel(/الموجز الشارح/).fill('Test Subtitle E2E');
    await page.locator('textarea').first().fill('Test description E2E for pioneer category.');
    await page.getByLabel(/أبرز الأعلام/).fill('E2E Figure');
    await page.getByLabel(/أبرز الأعلام/).press('Enter');
    await page.locator('textarea').nth(1).fill('E2E paragraph detail.');
    await page.click('button:has-text("حفظ الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/العنوان الرئيسي/).fill(updatedTitle);
    await page.click('button:has-text("حفظ الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });

  test('إضافة، تعديل، وحذف شخصية رائدة', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-pioneers', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'الشخصيات والرواد' }).click();
    await page.getByRole('button', { name: 'إضافة شخصية جديدة' }).click();

    const name = `Test Pioneer ${Date.now()}`;
    await page.getByLabel(/اسم الشخصية/).fill(name);
    await page.getByLabel(/اللقب/).fill('شاعر وأديب');
    await page.getByLabel(/الفئة المرتبطة/).fill('الأدباء والشعراء');
    await page.getByLabel(/الموقع/).fill('خنفر');
    await page.locator('textarea').first().fill('E2E description');
    await page.click('button:has-text("حفظ الشخصية")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${name}")`).first();
    await expect(row).toBeVisible();

    const updatedName = `Updated ${name}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/اسم الشخصية/).fill(updatedName);
    await page.click('button:has-text("حفظ الشخصية")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedName}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف الشخصية")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});

// =========================================================
//  3. المعالم
// =========================================================
test.describe('3. المعالم (Landmarks)', () => {
  test('إضافة، تعديل، وحذف فئة معلم', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-landmarks', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'فئات المعالم' }).click();
    await page.getByRole('button', { name: 'إضافة فئة جديدة' }).click();

    const title = `Test Landmark Cat ${Date.now()}`;
    await page.getByLabel(/العنوان الرئيسي/).fill(title);
    await page.getByLabel(/الموجز الشارح/).fill('Subtitle E2E');
    await page.locator('textarea').first().fill('Test description E2E for landmark category.');
    await page.getByLabel(/أبرز المعالم/).fill('E2E Landmark');
    await page.getByLabel(/أبرز المعالم/).press('Enter');
    await page.locator('textarea').nth(1).fill('E2E paragraph detail.');
    await page.click('button:has-text("حفظ الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/العنوان الرئيسي/).fill(updatedTitle);
    await page.click('button:has-text("حفظ الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });

  test('إضافة، تعديل، وحذف معلم تذكاري', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-landmarks', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'المعالم' }).first().click();
    await page.getByRole('button', { name: 'إضافة معلم جديد' }).click();

    const title = `Test Landmark ${Date.now()}`;
    await page.getByLabel(/الفئة المرتبطة/).fill('الحصون والقلاع');
    await page.getByLabel(/العنوان/).fill(title);
    await page.getByLabel(/التصنيف/).fill('معلم أثري');
    await page.getByLabel(/الموقع/).fill('خنفر');
    await page.locator('textarea').first().fill('E2E description');
    await page.click('button:has-text("حفظ المعلم")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/العنوان/).fill(updatedTitle);
    await page.click('button:has-text("حفظ المعلم")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف المعلم")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});

// =========================================================
//  4. التراث والثقافة
// =========================================================
test.describe('4. التراث والثقافة (Culture)', () => {
  test('إضافة، تعديل، وحذف فئة تراثية', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-culture', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'فئات الثقافة' }).click();
    await page.getByRole('button', { name: 'إضافة فئة جديدة' }).click();

    const title = `Test Culture Cat ${Date.now()}`;
    await page.getByLabel(/العنوان الرئيسي/).fill(title);
    await page.getByLabel(/الموجز الشارح/).fill('Subtitle E2E');
    await page.locator('textarea').first().fill('E2E culture category description.');
    await page.getByLabel(/أبرز المجالات/).fill('E2E Tag');
    await page.getByLabel(/أبرز المجالات/).press('Enter');
    await page.locator('textarea').nth(1).fill('E2E paragraph detail.');
    await page.click('button:has-text("حفظ الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/العنوان الرئيسي/).fill(updatedTitle);
    await page.click('button:has-text("حفظ الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف الفئة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });

  test('إضافة، تعديل، وحذف عنصر ثقافي', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-culture', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'العناصر والتراث' }).click();
    await page.getByRole('button', { name: 'إضافة عنصر جديد' }).click();

    const title = `Test Dish ${Date.now()}`;
    await page.getByLabel(/الفئة المرتبطة/).fill('شعر الدان');
    await page.getByLabel(/العنوان/).fill(title);
    await page.getByLabel(/التصنيف/).fill('وجبة شعبية');
    await page.getByLabel(/الموقع/).fill('شقرة');
    await page.locator('textarea').first().fill('E2E dish description.');
    await page.click('button:has-text("حفظ العنصر")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/العنوان/).fill(updatedTitle);
    await page.click('button:has-text("حفظ العنصر")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف العنصر")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});

// =========================================================
//  5. الاقتصاد
// =========================================================
test.describe('5. الاقتصاد (Economy)', () => {
  test('إضافة، تعديل، وحذف قطاع اقتصادي', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-economy', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'القطاعات الاقتصادية' }).click();
    await page.getByRole('button', { name: 'إضافة قطاع جديد' }).click();

    const title = `Test Economy Sector ${Date.now()}`;
    await page.getByLabel(/العنوان الرئيسي/).fill(title);
    await page.getByLabel(/الموجز/).fill('Subtitle E2E');
    await page.locator('textarea').first().fill('E2E economy sector description.');
    await page.getByLabel(/أبرز المحاصيل/).fill('E2E Product');
    await page.getByLabel(/أبرز المحاصيل/).press('Enter');
    await page.locator('textarea').nth(1).fill('E2E paragraph detail.');
    await page.click('button:has-text("حفظ القطاع")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/العنوان الرئيسي/).fill(updatedTitle);
    await page.click('button:has-text("حفظ القطاع")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف القطاع")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });

  test('إضافة، تعديل، وحذف عنصر اقتصادي', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-economy', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'العناصر والمحاصيل' }).click();
    await page.getByRole('button', { name: 'إضافة عنصر جديد' }).click();

    const title = `Test Crop ${Date.now()}`;
    await page.getByLabel(/القطاع المرتبط/).fill('الزراعة');
    await page.getByLabel(/العنوان/).fill(title);
    await page.getByLabel(/التصنيف/).fill('محصول استراتيجي');
    await page.getByLabel(/الموقع/).fill('دلتا بنا');
    await page.locator('textarea').first().fill('E2E crop description.');
    await page.click('button:has-text("حفظ العنصر")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/العنوان/).fill(updatedTitle);
    await page.click('button:has-text("حفظ العنصر")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف العنصر")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});

// =========================================================
//  6. المديريات والمناطق
// =========================================================
test.describe('6. المديريات والمناطق (Districts)', () => {
  test('إضافة، تعديل، وحذف منطقة تقسيمية', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-districts', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'فئات التقسيم العُرفي' }).click();
    await page.getByRole('button', { name: 'إضافة تقسيم جديد' }).click();

    const initialLabel = `Test Region ${Date.now()}`;
    await page.getByLabel(/الاسم المعروض/).fill(initialLabel);
    await page.locator('textarea').first().fill('E2E region description.');
    await page.click('button:has-text("حفظ التقسيم العُرفي")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${initialLabel}")`).first();
    await expect(row).toBeVisible();

    const updatedLabel = `Updated ${initialLabel}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/الاسم المعروض/).fill(updatedLabel);
    await page.click('button:has-text("حفظ التقسيم العُرفي")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedLabel}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.getByRole('button', { name: /حذف/ }).last().click();
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });

  test('إضافة، تعديل، وحذف مديرية جغرافية', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-districts', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'المديريات' }).click();
    await page.getByRole('button', { name: 'إضافة مديرية جديدة' }).click();

    const distName = `Test District ${Date.now()}`;
    await page.getByLabel(/اسم المديرية/).fill(distName);
    await page.getByLabel(/العنوان الشارح/).fill('قلب أبين الزراعي');
    await page.getByLabel(/التقسيم العرفي/).first().fill('دلتا أبين');
    await page.getByLabel(/اسم التقسيم العرفي/).fill('السهل الساحلي').catch(() => {});
    await page.getByLabel(/عاصمة/).fill('جعار');
    await page.getByLabel(/المساحة/).fill('1,500 كم²');
    await page.getByLabel(/النسبة المئوية/).fill('10%');
    await page.getByLabel(/أبرز المحاصيل/).fill('الموز');
    await page.getByLabel(/أبرز المحاصيل/).press('Enter');
    await page.getByLabel(/المعالم التاريخية/).fill('حصن');
    await page.getByLabel(/المعالم التاريخية/).press('Enter');
    await page.getByLabel(/القرى/).fill('قرية');
    await page.getByLabel(/القرى/).press('Enter');
    
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('E2E district history description.');
    await textareas.nth(1).fill('E2E geography description.');
    await page.click('button:has-text("حفظ المديرية")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${distName}")`).first();
    await expect(row).toBeVisible();

    const updatedDistName = `Updated ${distName}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/اسم المديرية/).fill(updatedDistName);
    await page.click('button:has-text("حفظ المديرية")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedDistName}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.getByRole('button', { name: /حذف/ }).last().click();
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});

// =========================================================
//  7. أقسام صفحة الهبوط (Landing)
// =========================================================
test.describe('7. أقسام صفحة الهبوط (Landing)', () => {
  test('إضافة، تعديل، وحذف بطاقة مبرزة بالرئيسية', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-landing', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'البطاقات المبرزة' }).click();
    await page.getByRole('button', { name: 'إضافة بطاقة' }).click();

    const title = `Test Highlight ${Date.now()}`;
    await page.getByLabel(/عنوان البطاقة/).fill(title);
    await page.getByLabel(/التصنيف/).fill('تاريخ');
    await page.locator('textarea').first().fill('E2E test highlight description.');
    await page.getByLabel(/نص الرابط/).fill('تصفح الآن');
    await page.getByLabel(/مسار الرابط/).fill('/landmarks');
    
    await page.click('button:has-text("حفظ البطاقة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${title}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${title}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/عنوان البطاقة/).fill(updatedTitle);
    await page.click('button:has-text("حفظ البطاقة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("حذف البطاقة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});

// =========================================================
//  8. حول أبين (About)
// =========================================================
test.describe('8. حول أبين (About)', () => {
  test('تعديل محور حول أبين', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-about', { waitUntil: 'networkidle' });
    
    const row = page.locator('table tbody tr').first();
    await expect(row).toBeVisible();
    
    await row.getByRole('button', { name: 'تعديل' }).click();
    await expect(page.locator('h2:has-text("تعديل")')).toBeVisible();
    
    await page.getByLabel(/عنوان الركيزة/).fill(`Updated Pillar ${Date.now()}`);
    await page.click('button:has-text("حفظ")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});

// =========================================================
//  9. التاريخ (History)
// =========================================================
test.describe('9. التاريخ والحقب (History)', () => {
  test('إضافة، تعديل، وحذف حقبة تاريخية', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin-history', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'إضافة حقبة جديدة' }).click();

    const eraTitle = `Test Era ${Date.now()}`;
    await page.getByLabel(/اسم الحقبة/).fill(eraTitle);
    await page.getByLabel(/الإطار الزمني/).fill('1900 - 1950');
    await page.getByLabel(/العاصمة التاريخية/).fill('زنجبار');
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('Short Summary E2E');
    await textareas.nth(1).fill('Full Description E2E');
    await page.getByLabel(/أبرز الأحداث/).fill('Event 1');
    await page.getByLabel(/أبرز الأحداث/).press('Enter');
    
    await page.click('button:has-text("حفظ")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    let row = page.locator(`tr:has-text("${eraTitle}")`).first();
    await expect(row).toBeVisible();

    const updatedTitle = `Updated ${eraTitle}`;
    await row.getByRole('button', { name: 'تعديل' }).click();
    await page.getByLabel(/اسم الحقبة/).fill(updatedTitle);
    await page.click('button:has-text("حفظ")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });

    row = page.locator(`tr:has-text("${updatedTitle}")`).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'حذف' }).click();
    await page.click('button:has-text("تأكيد الحذف"), button:has-text("حذف الحقبة")');
    await expect(page.locator('text=/بنجاح/')).toBeVisible({ timeout: 10000 });
  });
});
