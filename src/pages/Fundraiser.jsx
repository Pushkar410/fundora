import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";

function Fundraiser() {
    const { id } = useParams();

    const [fundraiser, setFundraiser] = useState(null);
    const [amount, setAmount] = useState("");

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
            // Save donation record
            await addDoc(collection(db, "donations"), {
                fundraiser_id: id,
                amount: donationAmount,
                created_at: new Date()
            });

            // Update fundraiser total
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

            <button onClick={donate}>
                Donate
            </button>
        </div>
    );
}

export default Fundraiser;