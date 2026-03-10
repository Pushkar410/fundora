import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { uploadImage } from "../utils/uploadImage";

function Fundraiser() {
    const { id } = useParams();

    const [fundraiser, setFundraiser] = useState(null);
    const [amount, setAmount] = useState("");
    const [image, setImage] = useState(null);

    const loadFundraiser = async () => {
        const ref = doc(db, "fundraisers", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            setFundraiser({ id: snap.id, ...snap.data() });
        }
    };

    useEffect(() => {
        loadFundraiser();
    }, []);

    const donate = async () => {
        if (!amount || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        const donationAmount = Number(amount);

        try {
            await addDoc(collection(db, "donations"), {
                fundraiser_id: id,
                amount: donationAmount,
                created_at: new Date()
            });

            const fundraiserRef = doc(db, "fundraisers", id);

            const newTotal =
                (fundraiser.total_raised || 0) + donationAmount;

            await updateDoc(fundraiserRef, {
                total_raised: newTotal
            });

            alert("Donation successful!");

            setAmount("");
            loadFundraiser();

        } catch (err) {
            console.error(err);
        }
    };

    const uploadProof = async () => {
        if (!image) {
            alert("Select image first");
            return;
        }

        try {
            const imageUrl = await uploadImage(image);

            await addDoc(collection(db, "progress_updates"), {
                fundraiser_id: id,
                proof_url: imageUrl,
                created_at: new Date()
            });

            alert("Proof uploaded successfully!");

        } catch (err) {
            console.error(err);
        }
    };

    if (!fundraiser) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: "500px" }}>
            <h1>{fundraiser.name}</h1>

            <p>{fundraiser.story}</p>

            <p>
                <b>Goal:</b> ₹{fundraiser.goal}
            </p>

            <p>
                <b>Raised:</b> ₹{fundraiser.total_raised || 0}
            </p>

            <hr />

            <h3>Donate</h3>

            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <br /><br />

            <button onClick={donate}>Donate</button>

            <hr />

            <h3>Upload Progress Proof</h3>

            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
            />

            <br /><br />

            <button onClick={uploadProof}>
                Upload Proof
            </button>
        </div>
    );
}

export default Fundraiser;