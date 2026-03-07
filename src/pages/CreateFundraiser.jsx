import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function CreateFundraiser() {
    const [name, setName] = useState("");
    const [story, setStory] = useState("");
    const [goal, setGoal] = useState("");

    const createFundraiser = async () => {
        if (!name || !story || !goal) {
            alert("Please fill all fields");
            return;
        }

        await addDoc(collection(db, "fundraisers"), {
            name,
            story,
            goal: Number(goal),
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
    };

    return (
        <div>
            <h1>Create Fundraiser</h1>

            <input
                placeholder="Fundraiser Name"
                onChange={(e) => setName(e.target.value)}
            />

            <br /><br />

            <textarea
                placeholder="Fundraiser Story"
                onChange={(e) => setStory(e.target.value)}
            />

            <br /><br />

            <input
                type="number"
                placeholder="Goal Amount"
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