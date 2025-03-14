const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "what do you know about computer repairs\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I have access to a vast amount of information about computer repairs, covering a wide range of topics. Here's a breakdown of what I know:\n\n**Common Computer Issues and Troubleshooting:**\n\n*   **Hardware Problems:**\n    *   **Power Issues:** No power, intermittent power, overheating, power supply failure.\n    *   **Display Problems:** No display, distorted display, flickering, dead pixels, incorrect resolution.\n    *   **Storage Problems:** Hard drive failures, SSD failures, corrupted data, slow performance, not recognized.\n    *   **Memory Problems:** RAM failures, system crashes, blue screen errors (BSODs), slow performance.\n    *   **Motherboard Issues:** Overheating, component failure, BIOS problems, connectivity issues.\n    *   **Peripheral Issues:** Keyboard, mouse, printer, speaker malfunctions, driver problems.\n*   **Software Problems:**\n    *   **Operating System Errors:** Boot errors, system crashes, slow performance, software conflicts, registry issues.\n    *   **Malware Infections:** Viruses, spyware, adware, ransomware, removal techniques.\n    *   **Driver Problems:** Missing drivers, outdated drivers, corrupted drivers, device conflicts.\n    *   **Software Conflicts:** Incompatible programs, application errors, performance issues.\n*   **Network Problems:**\n    *   **Connectivity Issues:** No internet access, slow internet speed, Wi-Fi problems, network adapter errors.\n    *   **Firewall Issues:** Blocking legitimate traffic, incorrect settings.\n    *   **DNS Problems:** Domain name resolution failures.\n    *   **IP Address Conflicts:** Multiple devices using the same IP address.\n\n**Repair Procedures:**\n\n*   **Diagnostics:**\n    *   **Visual Inspection:** Checking for physical damage, loose connections, dust buildup.\n    *   **Hardware Tests:** Using diagnostic software to test components like RAM, hard drives, and CPUs.\n    *   **Software Diagnostics:** Using system tools to identify software errors and conflicts.\n    *   **Event Logs:** Analyzing system event logs to find error messages and identify the source of problems.\n*   **Repair Techniques:**\n    *   **Hardware Replacement:** Replacing faulty components like RAM, hard drives, power supplies, and motherboards.\n    *   **Software Reinstallation:** Reinstalling the operating system or individual applications.\n    *   **Driver Updates:** Downloading and installing the latest drivers for hardware devices.\n    *   **Malware Removal:** Using antivirus and anti-malware software to remove infections.\n    *   **Data Recovery:** Recovering lost data from damaged hard drives or other storage devices.\n    *   **System Restore:** Reverting the system to a previous state.\n    *   **BIOS Updates:** Flashing the BIOS to fix bugs or add new features.\n*   **Preventative Maintenance:**\n    *   **Regular Cleaning:** Removing dust and debris from the computer.\n    *   **Software Updates:** Installing the latest software updates and security patches.\n    *   **Disk Defragmentation:** Optimizing hard drive performance.\n    *   **Backup and Recovery:** Creating regular backups of important data.\n\n**Tools and Equipment:**\n\n*   **Hardware Tools:** Screwdrivers, pliers, anti-static wrist straps, multimeters, soldering irons.\n*   **Software Tools:** Diagnostic software, antivirus software, data recovery software, operating system installation media.\n\n**Repair Ethics and Best Practices:**\n\n*   **Data Privacy:** Protecting the user's privacy and confidentiality.\n*   **Professionalism:** Providing courteous and professional service.\n*   **Accuracy:** Providing accurate diagnoses and repair estimates.\n*   **Documentation:** Keeping detailed records of repairs performed.\n*   **Safety:** Following safety precautions to prevent injury and damage.\n\n**Operating Systems:**\n\n*   **Windows:** All versions (XP, Vista, 7, 8, 8.1, 10, 11), troubleshooting common errors, driver issues, registry problems, blue screens.\n*   **macOS:** Troubleshooting common errors, hardware issues, software conflicts, data recovery.\n*   **Linux:** Basic troubleshooting, command-line tools, system administration.\n\n**Common Causes of Computer Problems:**\n\n*   **Dust Buildup:** Overheating, component failure.\n*   **Power Surges:** Damaged components.\n*   **Physical Damage:** Dropping the computer, spilling liquids.\n*   **Malware Infections:** System corruption, data theft.\n*   **Outdated Software:** Security vulnerabilities, compatibility issues.\n*   **User Error:** Incorrectly installing software, deleting important files.\n\n**Limitations:**\n\nWhile I have a wealth of information, I can't physically perform repairs. I can't:\n\n*   Physically disassemble or repair a computer.\n*   Diagnose problems based on physical symptoms without information provided to me.\n*   Replace hardware components.\n*   Provide guarantees about the success of repairs.\n\n**How I Can Help You:**\n\nI can assist you with computer repair by:\n\n*   **Troubleshooting:** Guiding you through troubleshooting steps to identify the cause of a problem.\n*   **Providing Information:** Giving you information about specific error messages, hardware components, or repair techniques.\n*   **Suggesting Solutions:** Offering possible solutions to common computer problems.\n*   **Explaining Technical Concepts:** Explaining complex technical concepts in simple terms.\n*   **Helping you find resources:** Providing links to websites, forums, and other resources for computer repair.\n\n**To get the most helpful advice from me, please provide as much detail as possible about the problem you're experiencing. The more information you give me, the better I can understand the situation and offer relevant suggestions.**\n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();