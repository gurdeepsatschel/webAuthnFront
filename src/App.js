import "./App.css";

export function bufferToBase64URLString(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = "";

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String = btoa(str);

  return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
const attachments = ["cross-platform", "platform"];

function toAuthenticatorAttachment(attachment) {
  if (!attachment) {
    return;
  }

  if (attachments.indexOf(attachment) < 0) {
    return;
  }

  return attachment;
}

export function base64URLStringToBuffer(base64URLString) {
  // Convert from Base64URL to Base64
  const base64 = base64URLString.replace(/-/g, "+").replace(/_/g, "/");
  /**
   * Pad with '=' until it's a multiple of four
   * (4 - (85 % 4 = 1) = 3) % 4 = 3 padding
   * (4 - (86 % 4 = 2) = 2) % 4 = 2 padding
   * (4 - (87 % 4 = 3) = 1) % 4 = 1 padding
   * (4 - (88 % 4 = 0) = 4) % 4 = 0 padding
   */
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64.padEnd(base64.length + padLength, "=");

  // Convert to a binary string
  const binary = atob(padded);

  // Convert binary string to buffer
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return buffer;
}

export function utf8StringToBuffer(value) {
  return new TextEncoder().encode(value);
}

function App() {
  const register = async () => {
    console.log("Button Clicked");
    let opt = {
      challenge: base64URLStringToBuffer(
        "dmSuxFoSk3kT4N7Nu93VXb2nN1YOkTPt79W_a1fn4wc"
      ),
      rp: {
        name: "Localhost",
        id: "localhost",
      },
      user: {
        id: utf8StringToBuffer("63f24ed34bfea937f99a1d5a"),
        name: "Avinash Mani Tripathi",
        displayName: "Avinash Mani Tripathi",
      },
      pubKeyCredParams: [
        {
          alg: -7,
          type: "public-key",
        },
        {
          alg: -257,
          type: "public-key",
        },
      ],
      timeout: "60000",
      attestation: "direct",
      excludeCredentials: [],
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        requireResidentKey: false,
      },
      extensions: {
        credProps: true,
      },
    };

    let credential = await navigator.credentials.create({ publicKey: opt });
    const { id, rawId, response, type } = credential;
    let transports = undefined;
    if (typeof response.getTransports === "function") {
      transports = response.getTransports();
    }
    const result = {
      id,
      rawId: bufferToBase64URLString(rawId),
      response: {
        attestationObject: bufferToBase64URLString(response.attestationObject),
        clientDataJSON: bufferToBase64URLString(response.clientDataJSON),
        transports,
      },
      type,
      clientExtensionResults: credential.getClientExtensionResults(),
      authenticatorAttachment: toAuthenticatorAttachment(
        credential.authenticatorAttachment
      ),
    };

    console.log(result);
  };

  const login = async () => {
    const loginOpts = {
      challenge: base64URLStringToBuffer(
        "lVDaNaetlRyUKFDpKMt-0OMbWOXkDq9ywGNMso6pHm0"
      ),
      allowCredentials: [],
      timeout: "60000",
      userVerification: "required",
      rpId: "localhost",
    };

    const credential = await navigator.credentials.get({
      publicKey: loginOpts,
    });
    console.log(credential);
    const { id, rawId, response, type } = credential;
    const newCredential = {
      id,
      rawId: bufferToBase64URLString(rawId),
      response: {
        authenticatorData: bufferToBase64URLString(response.authenticatorData),
        clientDataJSON: bufferToBase64URLString(response.clientDataJSON),
        signature: bufferToBase64URLString(response.signature),
        userHandle: bufferToBase64URLString(response.userHandle),
      },
      type,
      clientExtensionResults: credential.getClientExtensionResults(),
      authenticatorAttachment: toAuthenticatorAttachment(
        credential.authenticatorAttachment
      ),
    };
    console.log(newCredential);
  };

  return (
    <div className="App">
      <p id="field">This is will consist of object</p>
      <button onClick={register}>Register</button>
      <br></br>
      <br></br>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;
