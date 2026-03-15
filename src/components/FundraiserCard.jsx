import { Link } from "react-router-dom";

function FundraiserCard({ fundraiser }) {

    const raised = fundraiser.total_raised || 0;
    const goal = fundraiser.goal || 1;

    const progress = Math.min((raised / goal) * 100, 100);
    const progressWidth = (raised / goal) * 100;
    return (
        <div
            style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                width: "420px"
            }}
        >

            {/* IMAGE */}
            {fundraiser.image_url && (
                <img
                    src={fundraiser.image_url}
                    alt="fundraiser"
                    style={{
                        width: "100%",
                        borderRadius: "8px",
                        marginBottom: "10px"
                    }}
                />
            )}

            <Link to={`/fundraiser/${fundraiser.id}`}>
                <h2>{fundraiser.name}</h2>
            </Link>

            <p>{fundraiser.story}</p>

            <p><b>Goal:</b> ₹{goal}</p>
            <p><b>Raised:</b> ₹{raised}</p>

            {/* Progress bar */}
            <div
                style={{
                    background: "#ddd",
                    height: "10px",
                    borderRadius: "5px"
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        background: "green",
                        height: "100%",
                        borderRadius: "5px"
                    }}
                />
            </div>

            <p>{Math.round(progressWidth)}% funded</p>


        </div>
    );
}

export default FundraiserCard;