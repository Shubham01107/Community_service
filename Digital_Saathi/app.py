from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)


def check_message(message):

    text = message.lower()

    warnings = []
    categories = []
    score = 0

    # OTP
    if re.search(r"\botp\b|one time password|verification code", text):
        score += 20
        categories.append("OTP Scam")
        warnings.append(
            "The message is asking for or mentioning an OTP/verification code."
        )

    # UPI / Payment
    if re.search(
        r"\bupi\b|upi pin|payment|send money|pay now|transfer money|bank account",
        text
    ):
        score += 18
        categories.append("Payment Scam")
        warnings.append(
            "The message is related to money, UPI or online payment."
        )

    # KYC / Account
    if re.search(
        r"\bkyc\b|account blocked|account suspended|verify your account|update kyc",
        text
    ):
        score += 22
        categories.append("Fake KYC")
        warnings.append(
            "The message may be using KYC or account-blocking pressure."
        )

    # Urgency
    if re.search(
        r"urgent|immediately|right now|act now|within.*hour|last chance|hurry",
        text
    ):
        score += 12
        categories.append("Urgency / Pressure")
        warnings.append(
            "The message uses urgent or pressure-based language."
        )

    # Suspicious links
    if re.search(
        r"https?://|www\.|bit\.ly|tinyurl|click here|click now|open this link",
        text
    ):
        score += 20
        categories.append("Suspicious Link")
        warnings.append(
            "The message contains or asks you to open a link."
        )

    # Password / sensitive banking details
    if re.search(
        r"password|passcode|cvv|card number|atm pin|debit card|credit card",
        text
    ):
        score += 25
        categories.append("Sensitive Information")
        warnings.append(
            "The message may be trying to collect sensitive financial information."
        )

    # Lottery / Prize
    if re.search(
        r"lottery|you won|winner|prize|reward|lucky winner|cash prize",
        text
    ):
        score += 22
        categories.append("Prize Scam")
        warnings.append(
            "The message contains common lottery or prize scam language."
        )

    # Fake Job
    if re.search(
        r"work from home|easy money|registration fee|processing fee|job fee|joining fee",
        text
    ):
        score += 20
        categories.append("Fake Job Scam")
        warnings.append(
            "The message may be related to a fake job or fee-based scam."
        )

    # Private photos / personal photos
    if re.search(
        r"send me.*(private|personal|pvt).*photo|"
        r"send.*private photos|"
        r"send.*pvt photos|"
        r"private photo|"
        r"personal photo|"
        r"intimate photo|"
        r"nude photo|"
        r"naked photo",
        text
    ):
        score += 30
        categories.append("Privacy Risk")
        warnings.append(
            "The message is asking for private or sensitive photos. "
            "Do not send personal images to unknown or untrusted people."
        )

    # Blackmail / threat
    if re.search(
        r"blackmail|leak your photo|leak photos|viral your photo|"
        r"share your photo|threaten|pay or i will|"
        r"send money or i will",
        text
    ):
        score += 35
        categories.append("Blackmail / Threat")
        warnings.append(
            "The message contains possible threatening or blackmail language."
        )

    # Personal information
    if re.search(
        r"date of birth|dob|aadhaar|aadhar|pan card|address|phone number",
        text
    ):
        score += 15
        categories.append("Personal Data")
        warnings.append(
            "The message may be requesting personal information."
        )

    # Limit score
    score = min(score, 100)

    # Remove duplicate categories
    categories = list(dict.fromkeys(categories))

    # Risk level
    if score >= 60:
        risk = "HIGH"
        icon = "🚨"
        message_text = (
            "This message shows multiple serious warning signs. "
            "Do not click links, send money, or share sensitive information."
        )

    elif score >= 30:
        risk = "MEDIUM"
        icon = "⚠️"
        message_text = (
            "This message contains suspicious signs. "
            "Verify the sender independently before taking any action."
        )

    else:
        risk = "LOW"
        icon = "✅"
        message_text = (
            "No major warning signs were detected. "
            "Still avoid sharing sensitive information with unknown people."
        )

    return {
        "risk": risk,
        "score": score,
        "icon": icon,
        "message": message_text,
        "warnings": warnings,
        "categories": categories
    }


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check():

    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({
            "risk": "LOW",
            "score": 0,
            "icon": "ℹ️",
            "message": "Please enter a message.",
            "warnings": [],
            "categories": []
        })

    message = data["message"].strip()

    if message == "":
        return jsonify({
            "risk": "LOW",
            "score": 0,
            "icon": "ℹ️",
            "message": "Please enter a message.",
            "warnings": [],
            "categories": []
        })

    result = check_message(message)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)