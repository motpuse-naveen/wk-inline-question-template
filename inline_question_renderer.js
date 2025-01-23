//"st-upper-alpha", "st-lower-alpha", "st-upper-roman", "st-lower-roman", "st-decimal", "st-none"
const styleTypes = {
  'st-upper-alpha': ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  'st-lower-alpha': ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  'st-upper-roman': ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"],
  'st-lower-roman': ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"],
  'st-decimal':["1" ,"2","3","4","5","6","7","8","9","10","11","12","13","14","15", "16","17","18","19","20"]
}

class QuestionRenderer {
  constructor(questions,sharedProperties) {
    this.questions = questions;
    this.sharedProperties = sharedProperties;
  }
  render() {
    this.questions.forEach((question) => {
      const quesHandler = this.getHandler(question.type);
      if (quesHandler) {
        const questionElement = quesHandler.render(question);
        if(question.placeholder_id.startsWith("#")){
          $(question.placeholder_id).append(questionElement);
        }
        else{
          $("#" + question.placeholder_id).append(questionElement);
        }
        quesHandler.attachEvents(question);
      } else {
        console.error(`No handler for question type: ${question.type}`);
      }
    });

    //Add ARIA div, required for live announcement and aria-describedby 
    this.add_ARIA_Div_to_DOM();

    //Apply shared properties to question-main element.
    this.applySharedProperties();
  }
  getHandler(type) {
    const handlers = {
      MCMS: new MCMS_Handler(this.sharedProperties),
      MCQ: new MCQ_Handler(this.sharedProperties),
      SAQ: new SAQ_Handler(this.sharedProperties),
      SAX: new SAX_Handler(this.sharedProperties),
    };
    return handlers[type] || null;
  }
  applySharedProperties(){
    if(this.sharedProperties.maxWidth!=undefined && this.sharedProperties.maxWidth != ""){
      $(".question-main").css({"max-width":this.sharedProperties.maxWidth});
    }
    if(this.sharedProperties.alignment!=undefined && this.sharedProperties.alignment == "center"){
      $(".question-main").addClass("align-center");
    }
    else{
      $(".question-main").addClass("align-left");
    }
    if(this.sharedProperties.borderedBox!=undefined && this.sharedProperties.borderedBox == "true"){
      $(".question-main").addClass("bordered-box");
    }
  }
  add_ARIA_Div_to_DOM(){
    const divs = $(`
      <div id="ariaMessages" class="visually-hidden" aria-live="assertive"></div>
      <div id="ariaCorrect" class="visually-hidden"> Correct </div>
      <div id="ariaIncorrect" class="visually-hidden"> Incorrect </div>
      <div id="ariaAnswerExplanation" class="visually-hidden"> Answer Explanation </div>
    `)

    const elm_inline_question = $(".inline-question:first");
    if(elm_inline_question != undefined){
      elm_inline_question.before(divs)
    }
    else{
      const els_question_main = $(".question_main:first");
      if(els_question_main != undefined){
        els_question_main.before(divs)
      }
    }
  }
}

class MCMS_Handler{
  constructor(sharedProperties) {
    this.sharedProperties = sharedProperties; // Store sharedProperties for later use
  }

  render(question) {
    question.options = shuffleArray(question.options);
    const div = $(`
      <div id="${question.id}" class="question-main mcms" role="group" aria-labelledby="question_text_${question.id}">
      ${question.questionTitle!="" ? `<div class="question-title">${question.questionTitle}</div>` : ''}
        <div class="question-text" id="question_text_${question.id}">${question.questionHtml}</div>
        <div class="groupWrapper" role="group" aria-labelledby="question_text_${question.id}">
          <ul class="ques_checkboxgroup">
            ${question.options.map((option, index) =>
              `<li optionId="${option.id}">
                <span class="optionState" correct="${option.correct}" aria-hidden="true"></span>
                <input class="optionCheckbox" type="checkbox" name="${question.id}" id="${option.id}" value="${option.text}" correct="${option.correct}" />
                <label class="optionLabel" for="${option.id}">
                  ${question.optionStyleType!=undefined && question.optionStyleType!= "" ? `<span class="opt-abbr">${styleTypes[question.optionStyleType][index]}.</span>` : ''}
                  <span class="opt-txt">${option.text}</span>
                </label>
              </li>`
            ).join('')}
          </ul>
          <div class="question-feedback dis-none" aria-hidden="true"></div>
          <div class="question-controls">
              <button class="btn_style_primary submit-btn disabled" aria-disabled="true">Submit</button>
              <button class="btn_style_secondary reset-btn dis-none" aria-hidden="true">Try Again</button>
          </div>
        </div>
      </div>
    `);
    return div;
  }

  attachEvents(question) {
    $(`input[type="checkbox"][name="${question.id}"]`).on('click', function (event) {
      // Check if the checkbox has the 'disable' class
      if ($(this).hasClass('disabled')) {
        event.preventDefault(); // Prevent the checkbox from being checked/unchecked
        return false; // Exit the function early
      }
    });
    
    $(`input[type="checkbox"][name="${question.id}"]`).on('change', function () {
      // If the checkbox is disabled, skip processing
      if ($(this).hasClass('disabled')) {
        return false; // Exit the function early
      }
    
      const isChecked = $(this).prop('checked'); // Check if the input is checked (true/false)
      $(this).closest("li").find("span.optionState").attr("checked", (isChecked ? "true" : "false")); // Set the text to "true" or "false"
      
      // Check if at least one checkbox is checked to enable/disable the submit button
      const anyChecked = $(`input[type="checkbox"][name="${question.id}"]:checked`).length > 0;
      if (anyChecked) {
        $(`#${question.id} .submit-btn`).removeClass("disabled").attr("aria-disabled", "false");
      } else {
        $(`#${question.id} .submit-btn`).addClass("disabled").attr("aria-disabled", "true");
      }
    });

    // Handle "Submit" button click
    $(`#${question.id} .submit-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.submitAnswer(question);
      }
    });

    // Handle "Try Again" (reset) button click
    $(`#${question.id} .reset-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.resetAnswer(question);
      }
    });
  }
  submitAnswer(question) {
    const questionContainer = $(`#${question.id}`);
    const selectedOptions = questionContainer
      .find('input[type="checkbox"]:checked')
      .map(function () {
        return {
          id: $(this).attr("id"),
          text: $(this).val(),
          correct: $(this).attr("correct") === "true", // Convert "correct" attribute to boolean
        };
      })
      .get(); // Convert jQuery object to a regular array
  
    if(question.attempts == undefined){question.attempts = 0;}
    question.attempts += 1;
    // Store user's answer
    question.userAnswer = selectedOptions;
  
    // Evaluate the answer
    const isCorrect = selectedOptions.every((option) => option.correct) &&
                      selectedOptions.length === question.options.filter((opt) => opt.correct).length;
    
    // Store user's answer state correct/incorrect.
    question.isCorrect = isCorrect;

    //Set aria-describedby for checked items 
    questionContainer.find('input[type="checkbox"]:checked').each(function() {
      const isCorrect = $(this).attr('correct') === 'true'; // Check the 'data-correct' attribute
      const ariaValue = isCorrect ? 'ariaCorrect' : 'ariaIncorrect';

      $(this).attr('aria-describedby', ariaValue); // Add the aria-describedby attribute
    });
  
    // Display feedback
    const feedback = questionContainer.find(".question-feedback");
    const submitBtn = questionContainer.find('.submit-btn');
    const resetBtn = questionContainer.find('.reset-btn');
    debugger;
    var feedbackHtml = "";
    feedbackHtml = isCorrect ? question.correctFeedback : question.incorrectFeedback

    if(!isCorrect && this.sharedProperties.maxAttempts != undefined && this.sharedProperties.maxAttempts != 0){
      if(question.attempts>=this.sharedProperties.maxAttempts){
        feedbackHtml = question.attemptsExhaustedFeedback;
      }
    }
    feedback.html(feedbackHtml);
    feedback.removeClass("error success").addClass(isCorrect ? "success" : "error").removeClass("dis-none").attr("aria-hidden", "false");
    
    // Adjust the UI
    questionContainer.find("input[type='checkbox']").addClass("disabled").attr("aria-disabled", "true"); // Disable checkboxes
    questionContainer.find("label[for]").addClass("disabled"); // Disable checkboxes

    ariaAnnounce(feedback.text())
    //add submitted attribute to questionContainer
    questionContainer.attr("submitted","true");

    if(isCorrect){
      submitBtn.addClass("disabled").attr("aria-disabled", "true"); // Disable "Submit" button
    }
    else{
      submitBtn.addClass("dis-none disabled").attr("aria-hidden", "true").attr("aria-disabled", "true"); // Disable "Submit" button
      resetBtn.removeClass("dis-none").attr("aria-hidden", "false"); // Show "Try Again" button
      resetBtn.focus();
      if(this.sharedProperties.maxAttempts != undefined && this.sharedProperties.maxAttempts != 0){
        if(question.attempts>=this.sharedProperties.maxAttempts){
          //Show Correct Answers tick mark and update aria-describedby property.
          this.showAnswers(question, true);
        }
      }
    }
  }
  resetAnswer(question) {
    question.userAnswer = null;
    const questionContainer = $(`#${question.id}`);

    // Hide feedback
    const feedback = questionContainer.find(".question-feedback");
    const submitBtn = questionContainer.find('.submit-btn');
    const resetBtn = questionContainer.find('.reset-btn');

    feedback.text('');
    feedback.removeClass("error success").addClass("dis-none").attr("aria-hidden", "true");

    //Reset Option correct/incorrect icon state.
    questionContainer.find("span.optionState").attr("checked","false")

    // Adjust the UI
    questionContainer.find("input[type='checkbox']").prop('checked', false).removeClass("disabled").attr("aria-disabled", "false"); // Disable checkboxes
    questionContainer.find("input[type='checkbox']").removeAttr("aria-describedby");
    questionContainer.find("label[for]").removeClass("disabled");
    submitBtn.addClass("disabled").removeClass("dis-none").attr("aria-hidden", "false").attr("aria-disabled", "true"); // Disable "Submit" button
    resetBtn.addClass("dis-none").attr("aria-hidden", "true"); // Show "Try Again" button

    //remove submitted attribute to questionContainer
    questionContainer.attr("submitted","false");
    //On Reset/Retry shift focus to first checkbox.
    questionContainer.find("input[type='checkbox']:first").focus();
  }
  showAnswers(question, attemptsExhausted){
    const questionContainer = $(`#${question.id}`);
    if(attemptsExhausted){
      questionContainer.addClass("attemptsExhausted");
    }
    else{
      questionContainer.addClass("showAnsRequested");
    }
    questionContainer.find('input[type="checkbox"][correct="true"]').each(function() {
      $(this).attr('aria-describedby', 'ariaCorrect'); // Add the aria-describedby attribute
    });
    questionContainer.find(".reset-btn").addClass("disabled").attr("aria-disabled","true");
  }
}

class MCQ_Handler {
  constructor(sharedProperties) {
    this.sharedProperties = sharedProperties; // Store sharedProperties for later use
  }
  render(question) {
    question.options = shuffleArray(question.options);
    const div = $(`
      <div id="${question.id}" class="question-main mcq" role="group" aria-labelledby="question_text_${question.id}">
        ${question.questionTitle!="" ? `<div class="question-title">${question.questionTitle}</div>` : ''}
        <div class="question-text" id="question_text_${question.id}">${question.questionHtml}</div>
        <div class="groupWrapper" role="radiogroup" aria-labelledby="question_text_${question.id}">
          <ul class="ques_radiogroup">
            ${question.options.map((option, index) =>
              `<li optionId="${option.id}">
                <span class="optionState" correct="${option.correct}" aria-hidden="true"></span>
                <input class="optionCheckbox" type="radio" name="${question.id}" id="${option.id}" value="${option.text}" correct="${option.correct}" />
                <label  class="optionLabel" for="${option.id}">
                  ${question.optionStyleType!=undefined && question.optionStyleType!= "" ? `<span class="opt-abbr">${styleTypes[question.optionStyleType][index]}.</span>` : ''}
                  <span class="opt-txt">${option.text}</span>
                </label>
              </li>`
            ).join('')}
          </ul>
          <div class="question-feedback dis-none" aria-hidden="true"></div>
          <div class="question-controls">
            <button class="btn_style_primary submit-btn disabled" aria-disabled="true">Submit</button>
            <button class="btn_style_secondary reset-btn dis-none" aria-hidden="true">Try Again</button>
          </div>
        </div>
      </div>
    `);
    return div;
  }
  attachEvents(question) {
    $(`input[type="radio"][name="${question.id}"]`).on('click', function (event) {
      // Check if the checkbox has the 'disable' class
      if ($(this).hasClass('disabled')) {
        event.preventDefault(); // Prevent the checkbox from being checked/unchecked
        return false; // Exit the function early
      }
    });

    $(`input[type="radio"][name="${question.id}"]`).on('change', function (event) {
      // If the checkbox is disabled, skip processing
      if ($(this).hasClass('disabled')) {
        return false; // Exit the function early
      }

      $(this).closest("ul.ques_radiogroup").find("span.optionState").attr("checked","false")
      const isChecked = $(this).prop('checked'); // Check if the input is checked (true/false)
      $(this).closest("li").find("span.optionState").attr("checked", (isChecked ? "true" : "false")); // Set the text to "true" or "false"
      const anyChecked = $(`input[type="radio"][name="${question.id}"]:checked`).length > 0;
      //$(`#${question.id} .submit-btn`).prop('disabled', !anyChecked);
      if(anyChecked){
        $(`#${question.id} .submit-btn`).removeClass("disabled").attr("aria-disabled","false");
      }
      else{
        $(`#${question.id} .submit-btn`).addClass("disabled").attr("aria-disabled","true");
      }
    });
    // Handle "Submit" button click
    $(`#${question.id} .submit-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.submitAnswer(question);
      }
    });

    // Handle "Try Again" (reset) button click
    $(`#${question.id} .reset-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.resetAnswer(question);
      }
    });
  }
  submitAnswer(question) {
    const questionContainer = $(`#${question.id}`);
    const selectedOptions = questionContainer
      .find('input[type="radio"]:checked')
      .map(function () {
        return {
          id: $(this).attr("id"),
          text: $(this).val(),
          correct: $(this).attr("correct") === "true", // Convert "correct" attribute to boolean
        };
      })
      .get(); // Convert jQuery object to a regular array
  
    if(question.attempts == undefined){question.attempts = 0;}
    question.attempts += 1;
    // Store user's answer
    question.userAnswer = selectedOptions;
  
    // Evaluate the answer
    const isCorrect = selectedOptions.every((option) => option.correct) &&
                      selectedOptions.length === question.options.filter((opt) => opt.correct).length;

    // Store user's answer state correct/incorrect.
    question.isCorrect = isCorrect;

    //Set aria-describedby for checked items 
    questionContainer.find('input[type="radio"]:checked').each(function() {
      const isCorrect = $(this).attr('correct') === 'true'; // Check the 'data-correct' attribute
      const ariaValue = isCorrect ? 'ariaCorrect' : 'ariaIncorrect';
      $(this).attr('aria-describedby', ariaValue); // Add the aria-describedby attribute
    });
    
    const feedback = questionContainer.find(".question-feedback");
    const submitBtn = questionContainer.find('.submit-btn');
    const resetBtn = questionContainer.find('.reset-btn');

    // Display feedback
    var feedbackHtml = "";
    feedbackHtml = isCorrect ? question.correctFeedback : question.incorrectFeedback

    if(!isCorrect && this.sharedProperties.maxAttempts != undefined && this.sharedProperties.maxAttempts != 0){
      if(question.attempts>=this.sharedProperties.maxAttempts){
        feedbackHtml = question.attemptsExhaustedFeedback;
      }
    }
    feedback.text(feedbackHtml);
    feedback.removeClass("error success").addClass(isCorrect ? "success" : "error").removeClass("dis-none").attr("aria-hidden", "false");
    
    // Adjust the UI
    questionContainer.find("input[type='radio']").addClass("disabled").attr("aria-disabled", "true"); // Disable checkboxes
    questionContainer.find("label[for]").addClass("disabled"); // Disable checkboxes

    ariaAnnounce(feedback.text())
    //add submitted attribute to questionContainer
    questionContainer.attr("submitted","true");

    if(isCorrect){
      submitBtn.addClass("disabled").attr("aria-disabled", "true"); // Disable "Submit" button
    }
    else{
      submitBtn.addClass("dis-none disabled").attr("aria-hidden", "true").attr("aria-disabled", "true"); // Disable "Submit" button
      resetBtn.removeClass("dis-none").attr("aria-hidden", "false"); // Show "Try Again" button
      resetBtn.focus();
      if(this.sharedProperties.maxAttempts != undefined && this.sharedProperties.maxAttempts != 0){
        if(question.attempts>=this.sharedProperties.maxAttempts){
          //Show Correct Answers tick mark and update aria-describedby property.
          this.showAnswers(question, true)
        }
      }
    }
  }

  resetAnswer(question) {
    question.userAnswer = null;
    const questionContainer = $(`#${question.id}`);

    // Hide feedback
    const feedback = questionContainer.find(".question-feedback");
    const submitBtn = questionContainer.find('.submit-btn');
    const resetBtn = questionContainer.find('.reset-btn');
    feedback.text('');
    feedback.removeClass("error success").addClass("dis-none").attr("aria-hidden", "true");

    //Reset Option correct/incorrect icon state.
    questionContainer.find("span.optionState").attr("checked","false")

    // Adjust the UI
    questionContainer.find("input[type='radio']").prop('checked', false).removeClass("disabled").attr("aria-disabled", "false"); // Disable checkboxes
    questionContainer.find("input[type='radio']").removeAttr("aria-describedby");
    questionContainer.find("label[for]").removeClass("disabled");
    submitBtn.addClass("disabled").removeClass("dis-none").attr("aria-hidden", "false").attr("aria-disabled", "true"); // Disable "Submit" button
    resetBtn.addClass("dis-none").attr("aria-hidden", "true"); // Show "Try Again" button

    //remove submitted attribute to questionContainer
    questionContainer.attr("submitted","false");
    //On Reset/Retry shift focus to first radio.
    questionContainer.find("input[type='radio']:first").focus();
  }

  showAnswers(question, attemptsExhausted){
    const questionContainer = $(`#${question.id}`);
    if(attemptsExhausted){
      questionContainer.addClass("attemptsExhausted");
    }
    else{
      questionContainer.addClass("showAnsRequested");
    }
    questionContainer.find('input[type="radio"][correct="true"]').each(function() {
      $(this).attr('aria-describedby', 'ariaCorrect'); // Add the aria-describedby attribute
    });
    questionContainer.find(".reset-btn").addClass("disabled").attr("aria-disabled","true");
  }
}

class SAQ_Handler {
  constructor(sharedProperties) {
    this.sharedProperties = sharedProperties; // Store sharedProperties for later use
  }
  render(question) {
    const div = $(`
      <div id="${question.id}" class="question-main short-answer" role="group" aria-labelledby="question_text_${question.id}">
        ${question.questionTitle!="" ? `<div class="question-title">${question.questionTitle}</div>` : ''}
        <div class="question-text" id="question_text_${question.id}" for="textarea_${question.id}">${question.questionHtml}</div>
        <div class="groupWrapper">
          <div class="inputbox-wrapper">
            <span class="inputState" aria-hidden="true"></span>
            <textarea id="textarea_${question.id}" placeholder="Write your answer here...." rows="4" aria-label="Your answer" aria-labelledby="question_text_${question.id}"></textarea>
          </div>
          <div class="question-feedback dis-none" aria-hidden="true"></div>
          <div class="question-controls">
              <button class="btn_style_primary submit-btn disabled" aria-disabled="true">Submit</button>
              <button class="btn_style_secondary reset-btn dis-none" aria-hidden="true">Try Again</button>
          </div>
        </div>
      </div>
    `);
    return div;
  }

  attachEvents(question) {
    /*$(`#${question.id} input`).on('blur', function () {
      question.userAnswer = $(this).val().trim();
    });*/
    // Listen for input in the textarea
    $(`#${question.id} textarea`).on("input", function () {
      const text = $(this).val().trim(); // Get the trimmed value of the textarea
      // Enable the submit button if there is any text, disable otherwise
      if (text.length > 0) {
        $(`#${question.id} .submit-btn`).removeClass("disabled").attr("aria-disabled", "false");
      } else {
        $(`#${question.id} .submit-btn`).addClass("disabled").attr("aria-disabled", "true");
      }
    });

    // Handle "Submit" button click
    $(`#${question.id} .submit-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.submitAnswer(question);
      }
    });

    // Handle "Try Again" (reset) button click
    $(`#${question.id} .reset-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.resetAnswer(question);
      }
    });
  }

  submitAnswer(question){
    const questionContainer = $(`#${question.id}`);
    const feedback = questionContainer.find(".question-feedback");
    const textarea = questionContainer.find('textarea');
    const submitBtn = questionContainer.find('.submit-btn');
    const resetBtn = questionContainer.find('.reset-btn');
    
    // Example logic to check answer (this can be replaced with actual logic)
    var userAnswer = textarea.val().trim();
    const correctAnswer = question.answer; // Assuming `question.correctAnswer` is predefined
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    if(question.attempts == undefined){question.attempts = 0;}
    question.attempts += 1;
    question.userAnswer = userAnswer;
    // Display feedback
    var feedbackHtml = "";
    feedbackHtml = isCorrect ? question.correctFeedback : question.incorrectFeedback

    if(!isCorrect && this.sharedProperties.maxAttempts != undefined && this.sharedProperties.maxAttempts != 0){
      if(question.attempts>=this.sharedProperties.maxAttempts){
        feedbackHtml = question.attemptsExhaustedFeedback + " " + question.answer;
      }
    }
    feedback.text(feedbackHtml);
    feedback.removeClass("error success").addClass(isCorrect ? "success" : "error").removeClass("dis-none").attr("aria-hidden", "false");
    
    const ariaValue = isCorrect ? 'ariaCorrect' : 'ariaIncorrect';
    textarea.attr("readonly","true").addClass("disabled").attr("aria-disabled","true").attr('aria-describedby', ariaValue);;
    
    ariaAnnounce(feedback.text())
    //add submitted attribute to questionContainer
    questionContainer.attr("submitted","true");

    if(isCorrect){
      questionContainer.find(".inputState").addClass("correct").show();
      submitBtn.addClass("disabled").attr("aria-disabled", "true"); // Disable "Submit" button
    }
    else{
      questionContainer.find(".inputState").addClass("incorrect").show();
      submitBtn.addClass("dis-none disabled").attr("aria-hidden", "true").attr("aria-disabled", "true"); // Disable "Submit" button
      resetBtn.removeClass("dis-none").attr("aria-hidden", "false"); // Show "Try Again" button
      resetBtn.focus();
      if(this.sharedProperties.maxAttempts != undefined && this.sharedProperties.maxAttempts != 0){
        if(question.attempts>=this.sharedProperties.maxAttempts){
          //Show Correct Answers tick mark and update aria-describedby property.
          this.showAnswers(question, true)
        }
      }
    }
  }

  showAnswers(question, attemptsExhausted){
    const questionContainer = $(`#${question.id}`);
    /*
    const textarea = questionContainer.find('textarea');
    textarea.after($(`<div class="correct-answer">The Answer is: ${question.answer}</div>`))
    */
    questionContainer.find(".reset-btn").addClass("disabled").attr("aria-disabled","true");
  }

  resetAnswer(question) {
    const questionContainer = $(`#${question.id}`);
    const feedback = questionContainer.find(".question-feedback");
    const textarea = questionContainer.find('textarea');
    const submitBtn = questionContainer.find('.submit-btn');
    const resetBtn = questionContainer.find('.reset-btn');

    //Reset TextArea
    textarea.val('')
    textarea.removeAttr("readonly").removeClass("disabled").attr("aria-disabled","false").removeAttr("aria-describedby");

    questionContainer.find(".inputState").removeClass("correct incorrect").hide();

    //Reset Feedback
    feedback.text('');
    feedback.removeClass("error success").addClass("dis-none").attr("aria-hidden", "true");

    submitBtn.addClass("disabled").removeClass("dis-none").attr("aria-hidden", "false").attr("aria-disabled", "true"); // Disable "Submit" button
    resetBtn.addClass("dis-none").attr("aria-hidden", "true"); // Show "Try Again" button

    //remove submitted attribute to questionContainer
    questionContainer.attr("submitted","false");
    //Focus to textarea on reset.
    textarea.focus();
  }

  

}

class SAX_Handler{
  constructor(sharedProperties) {
    this.sharedProperties = sharedProperties; // Store sharedProperties for later use
  }
  render(question) {
    const div = $(`
      <div id="${question.id}" class="question-main short-answer" role="group" aria-labelledby="question_text_${question.id}">
        ${question.questionTitle!="" ? `<div class="question-title">${question.questionTitle}</div>` : ''}
        <div class="question-text" id="question_text_${question.id}" for="textarea_${question.id}">${question.questionHtml}</div>
        <div class="groupWrapper">
          <div class="inputbox-wrapper">
            <span class="inputState" aria-hidden="true"></span>
            <textarea id="textarea_${question.id}" placeholder="Write your answer here...." rows="4" aria-label="Your answer" aria-labelledby="question_text_${question.id}"></textarea>
          </div>
          <div class="question-feedback dis-none" aria-hidden="true"></div>
          <div class="question-controls">
              <button class="btn_style_primary submit-btn disabled" aria-disabled="true">Submit</button>
              <button class="btn_style_secondary reset-btn dis-none" aria-hidden="true">Try Again</button>
              <button class="btn_style_info icon show-answer-btn floatright" aria-expanded="false">Show Answer</button>
          </div>
          <div class="question-explanation dis-none" aria-hidden="true" aria-describedby="ariaAnswerExplanation">${question.explanation}</div>
        </div>
      </div>
    `);
    return div;
  }
  attachEvents(question) {
    // Listen for input in the textarea
    $(`#${question.id} textarea`).on("input", function () {
      const text = $(this).val().trim(); // Get the trimmed value of the textarea
      // Enable the submit button if there is any text, disable otherwise
      if (text.length > 0) {
        $(`#${question.id} .submit-btn`).removeClass("disabled").attr("aria-disabled", "false");
      } else {
        $(`#${question.id} .submit-btn`).addClass("disabled").attr("aria-disabled", "true");
      }
    });

    // Handle "Submit" button click
    $(`#${question.id} .submit-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.submitAnswer(question);
      }
    });

    // Handle "Try Again" (reset) button click
    $(`#${question.id} .reset-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.resetAnswer(question);
      }
    });

    // Handle "Try Again" (reset) button click
    $(`#${question.id} .show-answer-btn`).on('click', (event) => {
      if (!$(event.target).hasClass('disabled')) {
        this.toggleAnswer(event,question);
      }
    });
  }

  submitAnswer(question){
    const questionContainer = $(`#${question.id}`);
    const feedback = questionContainer.find(".question-feedback");
    const textarea = questionContainer.find('textarea');
    const submitBtn = questionContainer.find('.submit-btn');
    const resetBtn = questionContainer.find('.reset-btn');
    
    // Example logic to check answer (this can be replaced with actual logic)
    var userAnswer = textarea.val().trim();
    const correctAnswer = question.answer; // Assuming `question.correctAnswer` is predefined
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    if(question.attempts == undefined){question.attempts = 0;}
    question.attempts += 1;
    question.userAnswer = userAnswer;

    // Display feedback
    var feedbackHtml = "";
    feedbackHtml = isCorrect ? question.correctFeedback : question.incorrectFeedback

    if(!isCorrect && this.sharedProperties.maxAttempts != undefined && this.sharedProperties.maxAttempts != 0){
      if(question.attempts>=this.sharedProperties.maxAttempts){
        feedbackHtml = question.attemptsExhaustedFeedback + " " + question.answer;
      }
    }
    feedback.text(feedbackHtml);
    feedback.removeClass("error success").addClass(isCorrect ? "success" : "error").removeClass("dis-none").attr("aria-hidden", "false");
    const ariaValue = isCorrect ? 'ariaCorrect' : 'ariaIncorrect';
    textarea.attr("readonly","true").addClass("disabled").attr("aria-disabled","true").attr('aria-describedby', ariaValue);;
    
    ariaAnnounce(feedback.text())
    //add submitted attribute to questionContainer
    questionContainer.attr("submitted","true");

    if(isCorrect){
      questionContainer.find(".inputState").addClass("correct").show();
      submitBtn.addClass("disabled").attr("aria-disabled", "true"); // Disable "Submit" button
    }
    else{
      questionContainer.find(".inputState").addClass("incorrect").show();
      submitBtn.addClass("dis-none disabled").attr("aria-hidden", "true").attr("aria-disabled", "true"); // Disable "Submit" button
      resetBtn.removeClass("dis-none").attr("aria-hidden", "false"); // Show "Try Again" button
      resetBtn.focus();
      if(this.sharedProperties.maxAttempts != undefined && this.sharedProperties.maxAttempts != 0){
        if(question.attempts>=this.sharedProperties.maxAttempts){
          //Show Correct Answers tick mark and update aria-describedby property.
          this.showAnswers(question, true)
        }
      }
    }
  }

  showAnswers(question, attemptsExhausted){
    const questionContainer = $(`#${question.id}`);
    /*
    const textarea = questionContainer.find('textarea');
    textarea.after($(`<div class="correct-answer">The Answer is: ${question.answer}</div>`))
    */
    questionContainer.find(".reset-btn").addClass("disabled").attr("aria-disabled","true");
  }

  resetAnswer(question) {
    const questionContainer = $(`#${question.id}`);
    const feedback = questionContainer.find(".question-feedback");
    const textarea = questionContainer.find('textarea');
    const submitBtn = questionContainer.find('.submit-btn');
    const resetBtn = questionContainer.find('.reset-btn');

    //Reset TextArea
    textarea.val('')
    textarea.removeAttr("readonly").removeClass("disabled").attr("aria-disabled","false").removeAttr("aria-describedby");

    questionContainer.find(".inputState").removeClass("correct incorrect").hide();

    //Reset Feedback
    feedback.text('');
    feedback.removeClass("error success").addClass("dis-none").attr("aria-hidden", "true");

    submitBtn.addClass("disabled").removeClass("dis-none").attr("aria-hidden", "false").attr("aria-disabled", "true"); // Disable "Submit" button
    resetBtn.addClass("dis-none").attr("aria-hidden", "true"); // Show "Try Again" button

    //remove submitted attribute to questionContainer
    questionContainer.attr("submitted","false");
    //shift focus to textarea on reset
    textarea.focus();
  }

  toggleAnswer(event,question){
    const questionContainer = $(`#${question.id}`);
    const explanation = questionContainer.find(".question-explanation")
    
    $(event.target).toggleClass("expanded");

    if($(event.target).hasClass("expanded")){
      $(event.target).attr("aria-expanded","true");
      explanation.attr("aria-hidden","false").removeClass("dis-none")
      explanation.css("height", "0").animate({ height: explanation[0].scrollHeight + "px" }, "slow", "linear", function() {
        //expanded
        $(this).css({"height":"auto"});
      });
      //explanation[0].style.height = explanation[0].scrollHeight + "px"; // Set height to the full content height
    }
    else{
      $(event.target).attr("aria-expanded","false");
      explanation.animate({ height: "0px" }, "slow", "linear", function() {
        $(this).attr("aria-hidden","true").addClass("dis-none");
      });
    }
  }

}

var ariaClearTimeout = null;
function ariaAnnounce(msg) {
    console.log(msg);
    if (msg) {
        clearTimeout(ariaClearTimeout)
        $('#ariaMessages').html("");
        $('#ariaMessages').html(msg);
    }
    ariaClearTimeout = setTimeout(function () {
        $('#ariaMessages').html("");
    }, 5000);
};

function escapeHtml(text) {
  return text
      .replace(/&/g, "&amp;")  // Escape ampersand
      .replace(/</g, "&lt;")   // Escape less-than sign
      .replace(/>/g, "&gt;");  // Escape greater-than sign
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Initialize the renderer
$(document).ready(function () {
  const questionRenderer = new QuestionRenderer(inline_questions.questions, inline_questions.sharedProperties);
  questionRenderer.render();
})