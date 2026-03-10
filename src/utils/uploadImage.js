export const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "fundora_upload");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/drg7q3o5p/image/upload",
        {
            method: "POST",
            body: formData
        }
    );

    const data = await res.json();

    return data.secure_url;
};