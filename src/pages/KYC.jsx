import { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../utils/uploadImage";

function KYC() {

    const [file, setFile] = useState(null);
    const [type, setType] = useState("");

    const userPhone = localStorage.getItem("user_phone");

    const submitKYC = async () => {

        if (!file || !type) {
            alert("Upload document and select type");
            return;
        }

        try {

            const imageUrl = await uploadImage(file);

            const userRef = doc(db, "users", userPhone);

            await updateDoc(userRef, {
                kyc_document_url: imageUrl,
                kyc_document_type: type,
                kyc_status: "under_review"
            });

            alert("KYC submitted successfully");

        } catch (err) {
            console.error(err);
        }

    };

    return (

        <div style={{ maxWidth: "500px", margin: "auto" }}>

            <h2>KYC Verification</h2>

            <select onChange={(e) => setType(e.target.value)}>

                <option value="">Select Document</option>
                <option value="aadhaar">Aadhaar</option>
                <option value="pan">PAN</option>
                <option value="license">Driving License</option>

            </select>

            <br /><br />

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <br /><br />

            <button onClick={submitKYC}>
                Submit KYC
            </button>

        </div>

    );

}

export default KYC;