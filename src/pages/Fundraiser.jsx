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

import { calculateTrustScore } from "../utils/trustScore";
import { uploadImage } from "../utils/uploadImage";
import { checkPromotionEligibility } from "../utils/promotionCheck";

function Fundraiser() {

    const { id } = useParams();
    const currentUser = localStorage.getItem("user_phone");

    const [fundraiser, setFundraiser] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [amount, setAmount] = useState("");
    const [image, setImage] = useState(null);

    // Load fundraiser
    const loadFundraiser = async () => {

        const ref = doc(db, "fundraisers", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            setFundraiser({ id: snap.id, ...snap.data() });
        }

    };

    // Load updates
    const loadUpdates = async () => {

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

    };

    useEffect(() => {
        loadFundraiser();
        loadUpdates();
    }, []);

    // Update trust score and promotion
    useEffect(() => {

        if (!fundraiser) return;

        const updateScores = async () => {

            const fundraiserRef = doc(db, "fundraisers", id);

            const score = calculateTrustScore(fundraiser);

            const promotion = checkPromotionEligibility({
                ...fundraiser,
                final_score: score
            });

            await updateDoc(fundraiserRef, {
                final_score: score,
                promotion_ready: promotion.eligible,
                promotion_reason: promotion.reason
            });

        };

        updateScores();

    }, [fundraiser]);

    // Donation
    const donate = async () => {

        if (!amount || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        const donationAmount = Number(amount);

        await addDoc(collection(db, "donations"), {
            fundraiser_id: id,
            amount: donationAmount,
            created_at: new Date()
        });

        const fundraiserRef = doc(db, "fundraisers", id);

        const newTotal = (fundraiser.total_raised || 0) + donationAmount;

        await updateDoc(fundraiserRef, {
            total_raised: newTotal
        });

        setAmount("");
        loadFundraiser();

    };

    // Upload proof
    const uploadProof = async () => {

        if (!image) {
            alert("Select image first");
            return;
        }

        const imageUrl = await uploadImage(image);

        await addDoc(collection(db, "progress_updates"), {
            fundraiser_id: id,
            proof_url: imageUrl,
            created_at: new Date()
        });

        setImage(null);
        loadUpdates();

    };

    if (!fundraiser) return <p>Loading...</p>;

    // Countdown logic (after fundraiser is loaded)
    const startDate = fundraiser.campaign_start_date
        ? fundraiser.campaign_start_date.toDate()
        : new Date();

    const campaignDays = 30;

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + campaignDays);

    const today = new Date();

    const daysLeft = Math.max(
        Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)),
        0
    );

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>

            <h1>{fundraiser.name}</h1>

            <p>{fundraiser.story}</p>

            <p><b>Goal:</b> ₹{fundraiser.goal}</p>

            <p><b>Raised:</b> ₹{fundraiser.total_raised || 0}</p>

            <p><b>{daysLeft}</b> days left</p>

            <hr />

            <h3>Trust Score</h3>

            <p><b>Final Score:</b> {fundraiser.final_score || 0}/10</p>

            <hr />

            <h3>Donate</h3>

            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
            />

            <br /><br />

            <button onClick={donate}>Donate</button>

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

            <hr />

            <h3>Progress Updates</h3>

            {updates.length === 0 && <p>No updates yet</p>}

            {updates.map((u) => (
                <div key={u.id} style={{ marginBottom: "15px" }}>

                    {u.proof_url && (
                        <img
                            src={u.proof_url}
                            alt="proof"
                            style={{ width: "100%", borderRadius: "6px" }}
                        />
                    )}

                </div>
            ))}

        </div>
    );

}

export default Fundraiser;