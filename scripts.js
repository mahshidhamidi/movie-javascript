
API_KEY = "4052e0c90ddbe4ba0b60267c747f7de4"
TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDUyZTBjOTBkZGJlNGJhMGI2MDI2N2M3NDdmN2RlNCIsInN1YiI6IjY0ZGRlYjVlNWFiODFhMDExYzJkZDljZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PF4wmK6Jh9kq__RflrU8kgMngq_nMv1SOEV8zj0gbcU"

function displayResutls(movies) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');

        movieCard.classList.add('movie-card');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;
        movieCard.appendChild(movieTitle);

        movieCard.addEventListener('click', () => {
            populateFormMovidDetails(movie);
        });




        const movieImage = document.createElement('img');
        movieImage.classList.add('movie-image');
        let image_path = movie.poster_path;
        if (image_path === null) {
            movieImage.src = '/images/placeholder.png';
        } else {
            movieImage.src = `https://image.tmdb.org/t/p/w500${image_path}`;
        }

        movieCard.appendChild(movieImage);

        const movieRating = document.createElement('p');
        movieRating.textContent = ` ${movie.vote_average}`;
        movieCard.appendChild(movieRating);

        let credits = movie.credits;
        if (credits?.crew) {
            const movieDirector = document.createElement('span');
            movieDirector.classList.add('movie-director');
            let nameDirector = movie.credits.crew.find(crew => crew.known_for_department === 'Directing')?.name;
            if (nameDirector === undefined) {
                nameDirector = 'Unknown';
            }
            movieDirector.textContent = nameDirector;
            movieCard.appendChild(movieDirector);
        } else {
            const movieDirector = document.createElement('span');
            movieDirector.classList.add('movie-director');
            movieDirector.textContent = 'Unknown';
            movieCard.appendChild(movieDirector);
        }

        if (movie?.genre_names) {
            console.log(movie.genre_names);
            //mak div tags
            const genreDiv = document.createElement('div');
            genreDiv.classList.add('tags');
            movie.genre_names.forEach(genre => {
                const genreTag = document.createElement('span');
                genreTag.classList.add('tag');
                let colors = ['red', 'blue', 'green'];
                let randomColor = colors[Math.floor(Math.random() * colors.length)];
                genreTag.classList.add(`tag-${randomColor}`);
                genreTag.innerHTML = genre;
                genreDiv.appendChild(genreTag);
            });
            movieCard.appendChild(genreDiv);
        }

        searchResults.append(movieCard);




    });
}
/**
 * @returns {Promise} movies
 * @description search for movies
 */
function searchMovies() {
    let query = document.getElementById('search-input').value;
    if (query === '') {
        query = 'hello';
    }
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let movies = data.results;
            return movies;
        })
        .catch(error => {
            throw error;
        });
}

/**
 * 
 * @returns {Promise} genres
 * @description get movie genres
 */
function getMovieGenre() {
    const url = `https://api.themoviedb.org/3/genre/movie/list`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    };
    return fetch(url, options)
        .then(response => response.json())
        .then(data => {
            return data.genres;
        })
        .catch(error => {
            throw error;
        });
}

/**
 * 
 * @param {*} movie_id 
 * @returns Promise credits
 * @description get movie credits
 */
function credits(movie_id) {
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${API_KEY}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw error;
        });
}


async function doSearch() {

    showSkeletonLoader(10);


    let movies = await searchMovies();
    let genres = await getMovieGenre();

    const creditsPromises = movies.map(async movie => {
        let movie_credits = await credits(movie.id);
        movie.credits = movie_credits;

        const genre_names = movie.genre_ids.map(id => genres.find(genre => genre.id === id).name);
        movie.genre_names = genre_names;

        return movie; // this will return updated movie object with credits and genre names
    });

    const updatedMovies = await Promise.all(creditsPromises);

    displayResutls(updatedMovies);
}

function showSkeletonLoader(count = 10) {
    const searchResults = document.getElementById('search-results');
    for (let i = 0; i < count; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.classList.add('skeleton');

        const img = document.createElement('img');
        skeletonCard.appendChild(img);

        const title = document.createElement('h2');
        skeletonCard.appendChild(title);

        const rating = document.createElement('p');
        skeletonCard.appendChild(rating);

        searchResults.appendChild(skeletonCard);
    }
}

function populateFormMovidDetails(movie) {
    window.location.href = '#rating-form';

    let movie_name = movie.title;
    let description = movie.overview;

    document.getElementById('movie-name').value = movie_name;
    document.getElementById('movie-comment').value = "this is good film";

    let image_path = movie.poster_path;

    //add hidden input for image
    document.getElementById('movie-image').value = image_path;

    //add director
    let credits = movie.credits;
    if (credits?.crew) {
        let nameDirector = movie.credits.crew.find(crew => crew.known_for_department === 'Directing')?.name;
        if (nameDirector === undefined) {
            nameDirector = 'Unknown';
        }
        document.getElementById('movie-director').value = nameDirector;
    }

    //add year
    let year = movie.release_date;
    if (year) {
        document.getElementById('movie-year').value = year.substring(0, 4);
    }else{
        document.getElementById('movie-year').value = 1989;
    }
     

    

}


document.onload = doSearch();


window.onscroll = function () { scrollFunction() };


function scrollFunction() {
    let btn = document.getElementById('goToTopBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

function goToTop() {
    document.querySelector('body').scrollIntoView({ behavior: 'smooth' });

}

document.getElementById('rating-form').addEventListener('submit', submitRating);


function submitRating(event) {
    event.preventDefault();

    let movie_name = document.getElementById('movie-name').value;
    let movie_rate = document.querySelector('input[name="rating"]:checked');
    let moive_comment = document.getElementById('movie-comment').value;
    let movie_image = document.getElementById('movie-image').value;
    let movie_year = document.getElementById('movie-year').value;
    let movie_director = document.getElementById('movie-director').value;


    if(movie_rate){
        movie_rate = movie_rate.value;
    }else{        
        alert('Please select rating');
        return false;
    }

    const url = `http://127.0.0.1:5000/submit`;

    const data = {
        "title": movie_name,
        "year": movie_year,
        "comment": moive_comment,
        "rating": movie_rate,
        "poster_path": movie_image,
        "director": movie_director
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert('Rating submitted successfully');
        })
        .catch(error => {
            console.log(error);
        });

    return true;
}

