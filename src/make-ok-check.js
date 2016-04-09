function makeOkCheck({ okCodes, test } = {}) {
  return (response) => {
    if(test && test(response)) return response

    let codeOk = okCodes && okCodes.includes(response.status)

    if(!test && (response.ok || codeOk)) return response

    let error = new Error()

    throw error
  }
}

export default makeOkCheck
