import otpGenerator from 'otp-generator';

const generateOTP = () => {
    const OTP = otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        specialChars: false,
    })
    return OTP;
}

export default generateOTP;