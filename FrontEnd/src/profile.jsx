import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./profile.css";

function Profile() {
    const [following, setFollowing] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const storedUser = JSON.parse(localStorage.getItem("user"));
                setUser(storedUser);

                if (!token) {
                    navigate("/login");
                    return;
                }

                const res = await fetch("/api/user/following", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch following list");

                const data = await res.json();
                setFollowing(data.following);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) return <div className="profile-container">Loading profile...</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info">
                    <h1>My Profile</h1>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Status:</strong> {user?.role === "author" ? "Author" : user?.isPremium ? "Premium Reader" : "Free Member"}</p>
                    <div className="profile-stats">
                        <p><strong>Followers:</strong> {user?.followers?.length || 0}</p>
                        <p><strong>Following:</strong> {user?.following?.length || 0}</p>
                    </div>
                </div>
            </div>

            <hr className="profile-divider" />

            <div className="profile-section">
                <h2>Following ({following.length})</h2>
                {following.length > 0 ? (
                    <div className="following-list">
                        {following.map((author) => (
                            <div key={author._id} className="following-card">
                                <img src={author.image || "/images/profile1.png"} alt={author.name} />
                                <div className="following-details">
                                    <h3>{author.name}</h3>
                                    <p>{author.bio?.substring(0, 100)}...</p>
                                    <Link to={`/author/${author._id}`} className="view-author">View Profile →</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-following">You are not following any authors yet.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;