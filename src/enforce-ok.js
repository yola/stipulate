function makeOkCheck({ okCodes = [], test } = {}) {
  return (response) => {
    if(test && test(response)) {
      return response;
    }

    const codeOk = okCodes.indexOf(response.status) >= 0;

    if(!test && (response.ok || codeOk)) {
      return response;
    }

    const error = new Error(response.statusText || 'Bad Response');
    error.response = response;

    throw error;
  };
}

export default makeOkCheck;
