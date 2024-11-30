import { useState } from "react";
import { HfInference } from "@huggingface/inference";

export function ImageAnalyze() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<string | null>(null);

  const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const callImageToTextModel = async () => {
    console.log("callImageToTextModel called");

    if (!image) {
      console.error("No image file provided.");
      return;
    }

    try {      
        const response = await hf.imageToText({
        model: "nlpconnect/vit-gpt2-image-captioning", 
        data: image
      });

      
      //   const captions = response.map((res) => res.generated_text).join(", ");
      const captions = response.generated_text;
      console.log("Captions:", captions);
      setClassificationResult(captions);      
    } catch (error) {
      console.error("Error classifying image:", error);
    } finally {
      console.log("Image classification completed.");
    }
  };

  return (
    <>
      {preview && (
        <img
          src={preview}
          alt="Uploaded"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            marginBottom: "10px",
          }}
        />
      )}
      <input type="file" accept="image/*" onChange={handleImageUpload} /> <br />
      <button onClick={callImageToTextModel}>Analyze Image</button>
      {classificationResult && <div>{classificationResult}</div>}
    </>
  );
}
