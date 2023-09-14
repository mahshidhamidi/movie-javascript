document.onload = doSearch();


async function doSearch() {
    let movies = await getMovies();
    displayResutls(movies);
}

function displayResutls(movies) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';


    //sort movie by rating
    movies.sort((a, b) => b.rating - a.rating);

    movies.forEach(movie => {
        const movieCard = document.createElement('div');

        movieCard.classList.add('movie-card');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;
        movieCard.appendChild(movieTitle);

        const movieRating = document.createElement('p');
        movieRating.textContent = ` ${movie.rating}`;
        movieRating.classList.add('rating');


         //add star to rate
         const star = document.createElement('span');
         star.textContent = '⭐';
         star.classList.add('star');
         movieRating.appendChild(star);


        movieCard.appendChild(movieRating);

       


        const comment = document.createElement('p');
        comment.textContent = ` ${movie.comment}`;
        comment.classList.add('comment');
        movieCard.appendChild(comment);

        const movieImage = document.createElement('img');
        movieImage.classList.add('movie-image');
        let image_path = movie.poster_path;

        if (image_path === null) {
            movieImage.src = '/images/placeholder.png';
        } else {
            movieImage.src = `https://image.tmdb.org/t/p/w500${image_path}`;
        } 

        movieCard.appendChild(movieImage);

        //add director
        const movieDirector = document.createElement('span');
        movieDirector.classList.add('movie-director');
        movieDirector.textContent = movie.director;
        movieCard.appendChild(movieDirector);


        searchResults.append(movieCard);




    });
}

function getMovies() {
    return fetch('http://localhost:5000/movies')
        .then(response => response.json())
        .then(data => data.movies);
}