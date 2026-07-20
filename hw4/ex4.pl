:- module('ex4',
        [author/2,
         genre/2,
         book/4
        ]).

/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
maximum_printing_depth(100).
:- current_prolog_flag(toplevel_print_options, A),
   (select(max_depth(_), A, B), ! ; A = B),
   maximum_printing_depth(MPD),
   set_prolog_flag(toplevel_print_options, [max_depth(MPD)|B]).



author(a, asimov).
author(h, herbert).
author(m, morris).
author(t, tolkien).

genre(s, science).
genre(l, literature).
genre(sf, science_fiction).
genre(f, fantasy).

book(inside_the_atom, a, s, s(s(s(s(s(zero)))))).
book(asimov_guide_to_shakespeare, a, l, s(s(s(s(zero))))).
book(i_robot, a, sf, s(s(s(zero)))).
book(dune, h, sf, s(s(s(s(s(zero)))))).
book(the_well_at_the_worlds_end, m, f, s(s(s(s(zero))))).
book(the_hobbit, t, f, s(s(s(zero)))).
book(the_lord_of_the_rings, t, f, s(s(s(s(s(s(zero))))))).

% You can add more facts.

max_church(zero, B, B).
max_church(A, zero, A) :- A \= zero.
max_church(s(A), s(B), s(Max)) :- max_church(A, B, Max).

% Signature: max_list(Lst, Max)/2
% Purpose: true if Max is the maximum church number in Lst, false if Lst is emoty.
max_list([], false).
max_list([X], X).
max_list([X,Y|Rest], Max) :-
    max_church(X, Y, Bigger),
    max_list([Bigger|Rest], Max).







% Signature: author_of_genre(GenreName, AuthorName)/2
% Purpose: true if an author by the name AuthorName has written a book belonging to the genre named GenreName.
author_of_genre(GenreName, AuthorName):-
    genre(GenreId, GenreName),
    book(_, AuthorId, GenreId, _),
    author(AuthorId, AuthorName).        





% Signature: longest_book(AuthorName, BookName)/2
% Purpose: true if the longest book that an author by the name AuthorName has written is titled BookName.
longest_book(AuthorName, BookName) :-
    author(AuthorId, AuthorName),
    findall(Length, book(_, AuthorId, _, Length), Lengths),
    max_list(Lengths, MaxLen),
    book(BookName, AuthorId, _, MaxLen).