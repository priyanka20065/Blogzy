import { Link } from "react-router-dom";
import "./authorCard.css";

function AuthorCard({ name, blogs, image, famousBlogs, id, bio }) {
    return (
        <>
            <div className="AuthorCard">
                <div className="author-left">
                    <img src={image} alt={`${name} profile`} />
                    <span className="author-name">{name}</span>
                </div>

                <div className="author-middle">
                    <span className="author-count">{blogs} Blogs</span>

                    <Link
                        to={`/author/${id}`}
                        state={{ image, name }}
                        className="archive"
                    >
                        View Profile →
                    </Link>
                </div>
            </div>
            <hr className="author-card-line" />
        </>
    );
}

export default AuthorCard;