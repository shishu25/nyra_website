/**
 * Upload image to Cloudinary
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<string>} - URL of uploaded image
 */
export async function uploadToCloudinary(base64Image) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', base64Image);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'products');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload image');
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Upload video to Cloudinary
 * @param {string} base64Video - Base64 encoded video string
 * @returns {Promise<string>} - URL of uploaded video
 */
export async function uploadVideoToCloudinary(base64Video) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', base64Video);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'products');
  formData.append('resource_type', 'video');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload video');
  }

  const data = await response.json();
  return data.secure_url;
}
