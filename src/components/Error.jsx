const Error = ({ error }) => {
    return (
        <div className="error">
            <p>something went wrong...</p>
            <p>{error.message}</p>
        </div>
    );
};

export default Error;
