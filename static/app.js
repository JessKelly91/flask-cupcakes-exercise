const $cupcakeList = $('#cupcake-list')
const $createCupcakeSubmitBtn = $("#cupcake-form-submit-button")

async function loadPage(){
    const resp = await axios.get('/api/cupcakes');
    const cupcakes = resp.data.cupcakes;

    cupcakes.forEach(cupcake => {
        const newLi = $('<li>').html(`
            <strong>ID:</strong> ${cupcake.id} <br>
            <strong>Flavor:</strong> ${cupcake.flavor} <br>
            <strong>Size:</strong> ${cupcake.size} <br>
            <strong>Rating:</strong> ${cupcake.rating} <br>
            <strong>Image:</strong> ${cupcake.image}
        `);

        $cupcakeList.append(newLi)
    });
}

async function handleSubmitCreateCupcake(e){
    e.preventDefault();

    // Gather form data
    const flavor = $('#flavor').val();
    const size = $('#size').val();
    const rating = $('#rating').val();
    const image = $('#image').val();

    // Create a new cupcake object
    const newCupcake = {
        flavor: flavor,
        size: size,
        rating: parseFloat(rating),
        image: image,
    };
    
    //send post request to add new cupcake
    const resp = await axios.post('/api/cupcakes', newCupcake);
    console.log(resp)

    // Clear the form fields
    $('#flavor').val('');
    $('#size').val('');
    $('#rating').val('');
    $('#image').val('');

    // Add the new cupcake to the list without reloading the page
    const newLi = $('<li>').html(`
        <strong>ID:</strong> ${resp.data.id} <br>
        <strong>Flavor:</strong> ${resp.data.flavor} <br>
        <strong>Size:</strong> ${resp.data.size} <br>
        <strong>Rating:</strong> ${resp.data.rating} <br>
        <strong>Image:</strong> ${resp.data.image}
    `);

    $cupcakeList.append(newLi)
};

$createCupcakeSubmitBtn.on("click", handleSubmitCreateCupcake);

$(document).ready(loadPage)