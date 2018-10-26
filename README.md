# Iterowane gry macierzowe

Niniejsze repozytorium pozwala rozegrać pojedynek(ki) pomiędzy strategiami decyzyjnym dla wybranej gry macierzowej.

W grze dwóch graczy: wiersz i kolumna podejmują jednoczesną decyzje o wyborze swojej strategii tj. 0, 1 lub 2. Następnie wynik wyznaczany jest na podstawie macierzy wypłat (patrz poniżej), tj. na przecięciu wskazanym przez wybrane strategie. Pierwsza wartość w nawiasie to wypłata wiersza a druga to wypłata kolumny. Wynik dopisywany jest do tabeli wyników, która sumuje wartości w kolejnych powtórzeń. Na koniec powtórzenia gracze powiadamiani są o wybranej przez przeciwnika strategii oraz o przyznanym im wypłatom.  W ramach jednego meczu rozegranych zostanie 5000 powtórzeń a czas na pojedynczy wybór wynosi 1000 ms.

Grę wygrywa gracz, który zgromadzi największa całkowita wypłatę.

Przykład:
```
Wiersz wybrał 0;
Kolumna wybrała 1;
Wynik wiersz = 0, kolumna = 6;
Wiersz wybrał 0;
Kolumna wybrała 0;
Wynik wiersz = 3, kolumna = 9;
Grę wygrywa kolumna.
```

### Postać gry macierzowej

|  | 0 | 1 | 2 | 
|--|--|--|--|
| **0** | (3,3) | (0,6) | (6,0) |
| **1** | (6,0) | (3,3) | (0,6) |
| **2** | (0,6) | (6,0) | (3,3) |

Na starcie pojedynku wirtualni gracze otrzymają informację czy grają jako wiersz czy kolumna.

### Tworzenie gracza

UWAGA! Gracz musi być **deterministyczny**! Co oznacza, że w procesie decyzyjnym nie może korzystać z losowości!

By utworzyć gracza należy stworzyć obiekt zawierający 3 metody:
```javascript
{
    reset(color) {...},
    getDecision() {...},
    updateWithResult(result) {...}
}
```
Metoda `reset` wywoływana jest przed pojedynkiem i na jej wejście podawany jest kolor gracza `W` (wiersz) lub `K` (kolumna). Następnie w każdym powtórzeniu gracz proszony jest o decyzję poprzez metodę `getDecision`, która musi zwrócić wartość 0, 1 lub 2. Po wyliczeniu wypłat gracz otrzymuję informację o wyniku powtórzenia przez metodę `updateWithResult`, na wejście której podana jest tablica zawierająca strategię wybraną przez przeciwnika i wypłatę gracza, np. `[1, 6]`, gdzie `[strategia przeciwnika, wypłata gracza]`.

Utworzonego gracza należy zapisać w folderze `players` oraz dodać do tablicy w pliku `index.js`.
```javascript
...
const players = [
    ['rnd1', require('./players/RandomPlayer')],
    ['rnd2', require('./players/RandomPlayer')],
    ['mój gracz', require('./players/MyPlayer')],
];
...
```

### Inne

Komenda `npm install` instaluje niezbędne biblioteki.

Komenda `node index.js` uruchamia zawody.

W repozytorium znajduje się implementacja losowego gracza, który jest dobrym punktem startu.

