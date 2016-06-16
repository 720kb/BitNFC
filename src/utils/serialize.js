const serialize = (formElem) => {
  let form = document.querySelector(formElem)
  let formData = new FormData(form)
  let data = {}
  for (var pair of formData.entries()) {
    data[pair[0]] = pair[1]
  }
  return data
}

export default serialize
