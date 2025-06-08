function MovieCard({ movie, highlighted, onClick }) {
    
    return (
        <div
            onClick={onClick}
            className={`w-60 h-80 sm:w-44 sm:h-56 md:w-44 md:h-60 flex flex-col justify-start bg-black p-2 rounded-2xl ${highlighted ? "outline-1 outline-success" : ""}`}
        >
            <div className="h-66 sm:h-44 md:h-52 w-full overflow-hidden rounded-xl">
                <img
                    className="h-full w-full object-cover object-bottom"
                    src={movie.image_path}
                    alt="Movie image"
                />
            </div>
            <div className="py-1 px-1">
                <h2 className="font-bold text-xs md:text-sm">{movie.title}</h2>
                <div className="flex gap-2 text-[10px] sm:text-xs text-gray-300">
                    <span>{movie.genre}</span>
                    <span>{movie.duration} minutes</span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;
