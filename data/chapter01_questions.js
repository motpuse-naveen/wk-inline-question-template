//optionStyleType -- "st-upper-alpha", "st-lower-alpha", "st-upper-roman", "st-lower-roman", "st-decimal", "st-none"
//optionRandomize:true/false -- applicable only for the question type "MCMS" and "MCQ",

const inline_questions = {
  sharedProperties:{
    maxWidth:"960px",//"100%", "90%", "760px", "1024px"
    alignment:"center",//"center", "left"
    borderedBox:"true",//"true", "false"
    //alignment: "left" with borderedBox: "false" will be more suitable along with maxWidth: "100%"
    //alignment: "center" with borderedBox: "true" will be more suitable along with maxWidth: anything
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
            text : `Base excess`,
            correct : false,
        },
        {
            text : `Bicarbonate`,
            correct : false,
        },
        {
            text : `Carbon dioxide`,
            correct : false,//true,
        },
        {
            text : `Carbon monoxide`,
            correct : false, //true,
        },
        {
            text : `Glucose`,
            correct : false,
        },
        {
            text : `Helium`,
            correct : false, //true,
        },
        {
            text : `Hemoglobin`,
            correct : false,
        },
        {
            text : `Krypton`,
            correct : false, //true,
        },
        {
            text : `Nitrogen`,
            correct : true,
        },
        {
            text : `Oxygen`,
            correct : true,
        },
        {
            text : `pH`,
            correct : false,
        },
        ],
        correctFeedback: `Correct. You have selected right answers.`,
        incorrectFeedback: `Incorrect, Selected answers are not correct. Please try again.`,
        optionRandomize:true,
        optionStyleType:"st-lower-alpha",
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
        incorrectFeedback:`Your answer is incorrect. The correct answer is: "My Answer"`,
    },
    {
        id: "q2",
        type: "MCQ",//Multiple Choice Question.
        placeholder_id: "question_placeholder_2",
        questionTitle:``,
        questionHtml:`<p><strong>Clinical Problem:</strong> What is the maximum value attainable by adding the values obtained for SaO<sub>2</sub>, %COHb, and %MetHb from a single blood sample?</p>`,
        options:[
        {
            text : `100%`,
            correct : false,
        },
        {
            text : `200%`,
            correct : false,
        },
        {
            text : `Depends on the hemoglobin content`,
            correct : true,
        },
        ],
        correctFeedback: `Correct. You have selected right answer.`,
        incorrectFeedback: `Incorrect. You have selected wrong answer.`,
        optionRandomize:true,
        optionStyleType:"st-lower-alpha",
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
        incorrectFeedback:`Your answer is incorrect. The correct answer is: "Alveolar PO2 is directly related to the inspired oxygen pressure and inversely related to the PaCO2."`,
        explanation: `<p>The alveolar gas equation, introduced in the next chapter, shows that alveolar PO2 is directly related to the inspired oxygen pressure and inversely related to the PaCO2. The inspired oxygen pressure is fixed by the FIO2 and barometric pressure. Mountain climbers adapt at altitude principally by lowering PaCO2, thereby raising their alveolar (and arterial) PO2.</p>`
    }
  ],
};
