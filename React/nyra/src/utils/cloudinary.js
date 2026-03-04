/**
 * Upload image to Cloudinary
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<string>} - URL of uploaded image
 */
export async function uploadToCloudinary(base64Image) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log('Cloudinary config:', { cloudName, uploadPreset }); // Debug log

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials not configured. Check your .env file.');
  }

  try {
    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'products');

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log('Uploading to:', url); // Debug log

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary upload error:', error); // Debug log
      throw new Error(error.error?.message || `Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Upload successful:', data.secure_url); // Debug log
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload exception:', error);
    throw error;
  }
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
