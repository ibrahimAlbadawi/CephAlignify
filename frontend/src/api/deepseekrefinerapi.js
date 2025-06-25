export const callDeepSeekRefinement = async (rawText, type = "note") => {
    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${
                        import.meta.env.VITE_OPENROUTER_API_KEY
                    }`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://cephalignify.com", // or your local dev URL
                    "X-Title": "CephAlignify",
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
                    messages: [
                        {
                            role: "user",
                            content: `You are an expert medical writing assistant helping a dentist document clinical visit notes.

                                    The dentist has written the following ${type} during a consultation with a patient. These notes may be informal or unstructured.

                                    Please refine the notes to be clear, concise, and professional. Keep the summary under 50 words and use language suitable for both medical staff and patients.

                                    Provide only one final refined version. Do not include any headings, titles, explanations, or multiple options. Go straight to the refined note content only.

                                    Here are the notes:
                                    ${rawText}`,
                        },
                    ],
                }),
            }
        );

        const result = await response.json();

        const aiMessage = result?.choices?.[0]?.message?.content || "";
        return aiMessage;
    } catch (error) {
        console.error("DeepSeek API failed:", error);
        return "Could not refine text.";
    }
};
