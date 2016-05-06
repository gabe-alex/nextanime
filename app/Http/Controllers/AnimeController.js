'use strict'

const Anime = use('App/Model/Anime'),
  AnimeService = use("App/Services/AnimeService")

class AnimeController {
  *animepage (request, response) {
    const anime = (yield Anime.all()).value()
    if (anime) {
      AnimeService.insertDisplayTitles(anime)
      yield response.sendView('animepage', {anime: anime})
    }

    /*
    $(document).ready(function() {
      if($('#rec_anime_col').attr('id'))
      {
        response.view('animepage', {h3: 'Recommended'});
      }
    });
    $(document).ready(function() {
      if($('#top_anime_col').attr('id'))
      {
        response.view('animepage', {h3: 'Top Anime'});
      }
    });
    $(document).ready(function() {
      if($('#coming_soon_col').attr('id'))
      {
        response.view('animepage', {h3: 'Coming Soon'});
      }
    });*/
    
  }
}

module.exports = AnimeController
