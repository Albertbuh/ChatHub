import "./VerificationForm.css"

const VerificationForm = () => {
    return (
        <div className="wrapper" >
            <form action="">
                <h1>Verification</h1>
                <div className="input-box">
                    <input type="text" placeholder='Verification-code' required />
                </div>

                <button type="submit">NEXT</button>

                <div className="backwards">
                    <p>Incorrect phone? <a href="#">BACK</a></p>
                </div>
            </form>
        </div>
    )
}

export default VerificationForm;
