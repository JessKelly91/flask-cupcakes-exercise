const $cupcakeList = $('#cupcake-list')
const $newCupcakeForm = $('#new-cupcake-form')

function generateCupcakeHTML(cupcake){
    return `
    <div data-cupcake-id=${cupcake.id}>
    <li>
      ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
    </li>
    <img class="Cupcake-img"
          src="${cupcake.image}"
          alt="(no image provided)">
  </div>
    `;
}

async function showStartingCupcakes(){
    const resp = await axios.get('/api/cupcakes');
    const cupcakes = resp.data.cupcakes;

    for(let cupcake of cupcakes){
        let newCupcake = $(generateCupcakeHTML(cupcake));
        $cupcakeList.append(newCupcake);
    }
}

async function handleSubmitCreateCupcake(e){
    e.preventDefault();

    // Gather form data
    let flavor = $('#flavor').val();
    let size = $('#size').val();
    let rating = $('#rating').val();
    let image = $('#image').val();
    
    //send post request to add new cupcake
    const newCupcakeResp = await axios.post('/api/cupcakes', {
        flavor,
        size,
        rating,
        image
    });

    // Add the new cupcake to the list without reloading the page
    let newCupcake = $(generateCupcakeHTML(newCupcakeResp.data));
    $cupcakeList.append(newCupcake);
    $newCupcakeForm.trigger("reset");
};

$newCupcakeForm.on("submit", handleSubmitCreateCupcake);

$(showStartingCupcakes)