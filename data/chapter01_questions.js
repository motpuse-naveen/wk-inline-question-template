//optionStyleType -- "st-upper-alpha", "st-lower-alpha", "st-upper-roman", "st-lower-roman", "st-decimal", "st-none"
//optionRandomize:true/false -- applicable only for the question type "MCMS" and "MCQ",

const inline_questions = {
  sharedProperties:{
    maxWidth:"960px",//"100%", "90%", "760px", "1024px"
    alignment:"center",//"center", "left"
    borderedBox:"true",//"true", "false"
    //alignment: "left" with borderedBox: "false" will be more suitable along with maxWidth: "100%"
    //alignment: "center" with borderedBox: "true" will be more suitable along with maxWidth: anything
    maxAttempts: 2 //0 will be unlimited attempts untill user answers question correctly. 
    //1, 2, 3 etc will be the limits to no of maximum attempts.
  }, 
  questions: [
    {
        id: "q1",
        type: "MCMS",//Multiple Choice, Multiple Select
        placeholder_id: "question_placeholder_1",
        questionTitle:`<strong>Clinical Problem:</strong>`,
        questionHtml:`<p> With this definition in mind, choose which of the following values that represent <i>blood gases</i>?. The terms are listed in alphabetical order.</p>`,
        options:[
        {
            id: "q1_0",
            text : `Base excess`,
            correct : false,
        },
        {
            id: "q1_1",
            text : `Bicarbonate`,
            correct : false,
        },
        {
            id: "q1_2",
            text : `Carbon dioxide`,
            correct : false,//true,
        },
        {
            id: "q1_3",
            text : `Carbon monoxide`,
            correct : false, //true,
        },
        {
            id: "q1_4",
            text : `Glucose`,
            correct : false,
        },
        {
            id: "q1_5",
            text : `Helium`,
            correct : false, //true,
        },
        {
            id: "q1_6",
            text : `Hemoglobin`,
            correct : false,
        },
        {
            id: "q1_7",
            text : `Krypton`,
            correct : false, //true,
        },
        {
            id: "q1_8",
            text : `Nitrogen`,
            correct : true,
        },
        {
            id: "q1_9",
            text : `Oxygen`,
            correct : true,
        },
        {
            id: "q1_10",
            text : `pH`,
            correct : false,
        },
        ],
        correctFeedback: `Correct. You have selected right answers.`,
        incorrectFeedback: `Incorrect, Selected answers are not correct. Please try again.`,
        attemptsExhaustedFeedback: `Incorrect, Selected answers are not correct. Your retry attempts are exhausted.`,
        optionRandomize:true,
        optionStyleType:"st-lower-alpha",
        btnShowAnswer:true,
    },
    {
        id: "q3",
        type: "SAQ",//Short Answer/Box Question
        placeholder_id: "question_placeholder_3",
        questionTitle:``,
        questionHtml:`<p><strong>Clinical Problem:</strong> In the space that follows, write the values reported from a blood gas measurement in your lab, and state whether the SaO2 reported is calculated, measured, or both, i.e., two separate entries for SaO2.</p>`,
        answer:`My Answer`,//Text only not html
        generalFeedback:`Thanks for the values reported from a blood gas measurement in your lab.`,//Applicable only for Short Answer, if the user answer is not a fix value.
        correctFeedback:`Your answer is correct!`,
        incorrectFeedback:`That's not quite right. Let’s try again.`,
        attemptsExhaustedFeedback: `That's not quite right. Your retry attempts are exhausted. The correct answer is:`,
        btnShowAnswer:true,
    },
    {
        id: "q2",
        type: "MCQ",//Multiple Choice Question.
        placeholder_id: "question_placeholder_2",
        questionTitle:``,
        questionHtml:`<p><strong>Clinical Problem:</strong> What is the maximum value attainable by adding the values obtained for SaO<sub>2</sub>, %COHb, and %MetHb from a single blood sample?</p>`,
        options:[
        {
            id: "q2_0",
            text : `100%`,
            correct : false,
        },
        {
            id: "q2_1",
            text : `200%`,
            correct : false,
        },
        {
            id: "q2_2",
            text : `Depends on the hemoglobin content`,
            correct : true,
        },
        ],
        correctFeedback: `Correct. You have selected right answer.`,
        incorrectFeedback: `Incorrect. You have selected wrong answer. Please try again.`,
        attemptsExhaustedFeedback: `Incorrect. You have selected wrong answer. Your retry attempts are exhausted.`,
        optionRandomize:true,
        optionStyleType:"st-lower-alpha",
        btnShowAnswer:false,
    },
    {
        id: "q8",
        type: "MCQ",//Multiple Choice Question.
        placeholder_id: "question_placeholder_8",
        questionTitle:`<strong>Question:</strong>`,
        questionHtml:`<p>Which of the following is routinely measured as part of an arterial blood gas (ABG) test?</p>`,
        options:[
        {
            id: "q8_0",
            text : `Nitrogen`,
            correct : false,
        },
        {
            id: "q8_1",
            text : `Carbon monoxide as %COHb`,
            correct : true,
        },
        {
            id: "q8_2",
            text : `Helium`,
            correct : false,
        },
        {
            id: "q8_3",
            text : `Glucose`,
            correct : false,
        },
        ],
        correctFeedback: `Correct. You have selected right answer.`,
        incorrectFeedback: `Incorrect. You have selected wrong answer. Please try again.`,
        attemptsExhaustedFeedback: `Incorrect. You have selected wrong answer. Your retry attempts are exhausted.`,
        optionRandomize:true,
        optionStyleType:"st-lower-alpha",
        btnShowAnswer:false,
    },
    {
        id: "q6",
        type: "SAX",//Short Answer with Explanation
        placeholder_id: "question_placeholder_6",
        questionTitle:`<strong>Clinical Problem 1.1.</strong>`,
        questionHtml:`<p> What are the two broad options to maintain acceptable oxygen levels at extreme altitudes?</p>`,
        answer:`Change the environment or adapt physiologically.`,//Text only not html
        generalFeedback:`Thanks for the values reported from a blood gas measurement in your lab.`,//Applicable only for Short Answer, if the user answer is not a fix value.
        correctFeedback:`Your answer is correct!`,
        incorrectFeedback:`That's not quite right. Let’s try again.`,
        attemptsExhaustedFeedback: `That's not quite right. Your retry attempts are exhausted. The correct answer is:`,
        explanation: `<p><strong>Change the environment:</strong> Use tools like oxygen tanks or pressurized cabins to increase oxygen availability.</p>
        <p><strong>Adapt physiologically:</strong> The body adjusts over time by producing more red blood cells, increasing breathing rate, and improving oxygen delivery.</p>`,
        btnShowAnswer:false,
    },
    {
        id: "q5",
        type: "MCMS",//Multiple Choice, Multiple Select
        placeholder_id: "question_placeholder_5",
        questionTitle:`<strong>Clinical Problem:</strong>`,
        questionHtml:`<p>Which of the following statements is most accurate?</p>`,
        options:[
        {
            id: "q5_0",
            text : `Ultrasound consists of waves of compression and decompression, traveling at a variable speed through a specific medium (such as fat or blood).`,
            correct : false,
        },
        {
            id: "q5_1",
            text : `Ultrasound is considered too high for human hearing (generally &gt; 2,000 Hz), and infrasound is too low for human hearing (generally &lt; 200 Hz).`,
            correct : false,
        },
        {
            id: "q5_2",
            text : `Ultrasound travels in a “longitudinal” (not sinusoidal) wave oscillating back and forth within the direction the sound was transmitted.`,
            correct : true,//true,
        },
        {
            id: "q5_3",
            text : `Most 2D ultrasound probes used in cardiac imaging consist of a range of 2.5 to 5.0 Hz.`,
            correct : true, //true,
        },
        ],
        correctFeedback: `Correct. You have selected right answers.`,
        incorrectFeedback: `Incorrect, Selected answers are not correct. Please try again.`,
        attemptsExhaustedFeedback: `Incorrect, Selected answers are not correct. Your retry attempts are exhausted.`,
        optionRandomize:true,
        optionStyleType:"st-lower-alpha",
        btnShowAnswer:false,
    },
    {
        id: "q4",
        type: "SAX",//Short Answer with Explanation
        placeholder_id: "question_placeholder_4",
        questionTitle:`<strong>Clinical Problem 1.1.</strong>`,
        questionHtml:`<p> Two men first climbed the summit of Mount Everest without supplemental oxygen in 1978, and others have done so since. What major physiologic adaptation do you suppose makes such a climb possible?</p>`,
        answer:`alveolar PO2 is directly related to the inspired oxygen pressure and inversely related to the PaCO2.`,//Text only not html
        generalFeedback:`Thanks for the values reported from a blood gas measurement in your lab.`,//Applicable only for Short Answer, if the user answer is not a fix value.
        correctFeedback:`Your answer is correct!`,
        incorrectFeedback:`That's not quite right. Let’s try again.`,
        attemptsExhaustedFeedback: `That's not quite right. Your retry attempts are exhausted. The correct answer is:`,
        explanation: `<p>The alveolar gas equation, introduced in the next chapter, shows that alveolar PO2 is directly related to the inspired oxygen pressure and inversely related to the PaCO2. The inspired oxygen pressure is fixed by the FIO2 and barometric pressure. Mountain climbers adapt at altitude principally by lowering PaCO2, thereby raising their alveolar (and arterial) PO2.</p>`,
        btnShowAnswer:false,
    },
    {
        id: "q7",
        type: "MCMS",//Multiple Choice, Multiple Select
        placeholder_id: "question_placeholder_7",
        questionTitle:`<strong>Clinical Problem:</strong>`,
        questionHtml:`<p>What other information is needed to interpret blood gas data?</p>`,
        options:[
        {
            id: "q7_0",
            text : `Clinical context (e.g., symptoms, medical history).`,
            correct : true,
        },
        {
            id: "q7_1",
            text : `Eye color of the patient.`,
            correct : false,
        },
        {
            id: "q7_2",
            text : `FiO₂ (Fraction of Inspired Oxygen).`,
            correct : true,
        },
        {
            id: "q7_3",
            text : `Weight of the patient (unless relevant to clinical context).`,
            correct : false, //true,
        },
        {
            id: "q7_4",
            text : `Vital signs (e.g., respiratory rate, oxygen saturation).`,
            correct : true,
        },
        {
            id: "q7_5",
            text : `Blood type.`,
            correct : false, //true,
        },
        {
            id: "q7_6",
            text : `Electrolyte levels (e.g., bicarbonate).`,
            correct : true,
        },
        {
            id: "q7_7",
            text : `Body temperature.`,
            correct : true, //true,
        },
        {
            id: "q7_8",
            text : `Time of day the test was taken (irrelevant for interpretation).`,
            correct : false,
        }
        ],
        correctFeedback: `Correct. You have selected right answers.`,
        incorrectFeedback: `Incorrect, Selected answers are not correct. Please try again.`,
        attemptsExhaustedFeedback: `Incorrect, Selected answers are not correct. Your retry attempts are exhausted.`,
        optionRandomize:true,
        optionStyleType:"st-upper-alpha",
        btnShowAnswer:false,
    },
  ],
};
