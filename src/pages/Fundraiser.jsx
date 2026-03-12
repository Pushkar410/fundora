import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";

import { uploadImage } from "../utils/uploadImage";

function Fundraiser() {
    const { id } = useParams();
    const currentUser = localStorage.getItem("user_phone");
    const [fundraiser, setFundraiser] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [amount, setAmount] = useState("");
    const [image, setImage] = useState(null);

    // Load fundraiser
    const loadFundraiser = async () => {
        try {
            const ref = doc(db, "fundraisers", id);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setFundraiser({ id: snap.id, ...snap.data() });
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Load progress updates
    const loadUpdates = async () => {
        try {
            const q = query(
                collection(db, "progress_updates"),
                where("fundraiser_id", "==", id)
            );

            const snapshot = await getDocs(q);

            const list = [];

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            setUpdates(list);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadFundraiser();
        loadUpdates();
    }, []);

    // Donation function
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

            alert("Donation successful");

            setAmount("");
            loadFundraiser();

        } catch (err) {
            console.error(err);
        }
    };

    // Upload progress proof
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

            alert("Proof uploaded successfully");

            setImage(null);
            loadUpdates();

        } catch (err) {
            console.error(err);
        }
    };

    if (!fundraiser) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>

            <h1>{fundraiser.name}</h1>

            <p>{fundraiser.story}</p>

            <p><b>Goal:</b> ₹{fundraiser.goal}</p>

            <p><b>Raised:</b> ₹{fundraiser.total_raised || 0}</p>

            <hr />

            {/* TRUST SCORE */}

            <h3>Trust Score</h3>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px"
                }}
            >

                <p><b>Final Score:</b> {fundraiser.final_score || 0} / 10</p>

                <p>
                    AI Verification:
                    {fundraiser.ai_score > 0 ? " ✔ Verified" : " Pending"}
                </p>

                <p>
                    Community Confirmation:
                    {fundraiser.community_score > 0 ? " ✔ Verified" : " Pending"}
                </p>

                <p>
                    Document Verification:
                    {fundraiser.doc_score > 0 ? " ✔ Verified" : " Pending"}
                </p>

            </div>

            <hr />

            {/* DONATE */}

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

            {/* UPLOAD PROOF */}


            {currentUser === fundraiser.created_by && (
                <>
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
                </>
            )}
            <br /><br />

            <button onClick={uploadProof}>
                Upload Proof
            </button>

            <hr />

            {/* PROGRESS TIMELINE */}

            <h3>Progress Updates</h3>

            {updates.length === 0 && <p>No updates yet</p>}

            {updates.map((u) => (
                <div
                    key={u.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px"
                    }}
                >

                    {u.proof_url && (
                        <img
                            src={u.proof_url}
                            alt="proof"
                            style={{
                                width: "100%",
                                borderRadius: "6px",
                                marginBottom: "10px"
                            }}
                        />
                    )}

                    <p>Update uploaded</p>

                </div>
            ))}

        </div>
    );
}

export default Fundraiser;