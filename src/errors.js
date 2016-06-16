const header = (err) => {
  console.log("--------------------------------------------")
  console.log("Err. message:")
  console.error(err.message)
  console.log("--------------------------------------------")
}

// error messages (to match)
let errOnlyChild = 'onlyChild must be passed a children with exactly one child.'

const catchErrors = (err) => {
  header(err)
  if (err.message == errOnlyChild) {
    console.log("You have a Provider with two elements inside it")
  }
  console.log("--------------------------------------------")
}

export default catchErrors
