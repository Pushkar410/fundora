import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc
} from "firebase/firestore";

function CreateFundraiser() {

    const [name, setName] = useState("");
    const [story, setStory] = useState("");
    const [goal, setGoal] = useState("");
    const [user, setUser] = useState(null);

    const userPhone = localStorage.getItem("user_phone");

    // Load user
    const loadUser = async () => {

        if (!userPhone) return;

        try {

            const ref = doc(db, "users", userPhone);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setUser(snap.data());
            }

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const createFundraiser = async () => {

        if (!user) {
            alert("User not loaded");
            return;
        }

        // KYC restriction
        if (!user.kyc_verified) {
            alert("Complete KYC before creating fundraiser");
            return;
        }

        if (!name || !story || !goal) {
            alert("Please fill all fields");
            return;
        }

        try {

            await addDoc(collection(db, "fundraisers"), {

                name,
                story,
                goal: Number(goal),

                created_by: userPhone,

                ai_score: 0,
                community_score: 0,
                doc_score: 0,
                final_score: 0,

                confirmations: 0,

                promo_wallet: 0,

                total_raised: 0,
                donation_count: 0,
                unique_donors: 0,

                lifecycle_status: "draft",
                verification_status: "pending",
                status: "pending",
                visibility: "private",

                withdrawn_amount: 0,
                withdrawal_stage: 0,
                withdrawal_locked: true,

                created_at: serverTimestamp(),
                campaign_start_date: serverTimestamp()

            });

            alert("Fundraiser created!");

            setName("");
            setStory("");
            setGoal("");

        } catch (err) {
            console.error(err);
        }

    };

    return (

        <div style={{ maxWidth: "500px", margin: "auto" }}>

            <h1>Create Fundraiser</h1>

            {!user?.kyc_verified && (
                <p style={{ color: "red" }}>
                    You must complete KYC before creating a fundraiser.
                </p>
            )}

            <input
                placeholder="Fundraiser Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <br /><br />

            <textarea
                placeholder="Fundraiser Story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
            />

            <br /><br />

            <input
                type="number"
                placeholder="Goal Amount"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
            />

            <br /><br />

            <button onClick={createFundraiser}>
                Create Fundraiser
            </button>

        </div>

    );

}

export default CreateFundraiser;