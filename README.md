# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally

To run this application on your local machine, please follow these steps:

1.  **Install Node.js:** If you don't have it already, download and install Node.js (which includes npm) from [nodejs.org](https://nodejs.org/).
2.  **Install Dependencies:** Open a terminal in the root directory of the project and run the following command to install the necessary packages:
    ```bash
    npm install
    ```
3.  **Set Up Environment Variables:** Create a file named `.env.local` in the root of your project and add your Gemini API key like this:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    Replace `YOUR_API_KEY_HERE` with the actual key you obtained from Google AI Studio.
4.  **Run the Development Server:** After the installation is complete, run this command to start the app:
    ```bash
    npm run dev
    ```
5.  **View the App:** The application will now be running. You can view it by opening your web browser and navigating to [http://localhost:9002](http://localhost:9002).
