$(function () {
    var cellW = 18,
        cellH = 18,
        crossW,
        crossH,
        crossC,
        grid1 = $('.grid--1'),
        grid2 = $('.grid--2'),
        grid3 = $('.grid--3'),
        cross = {},
        hint = {
            w: [],
            h: []
        },
        crossImported = [],
        // crossCanvas,
        is_dragging = false,
        curEl = -1,
        erase = false;

    $('#file-selector').change(function () {
        const [file] = document.getElementById('file-selector').files;
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            crossImported = JSON.parse(reader.result);
            hint = crossImported.hintData;
            cross = crossImported.crossData;
            crossW = cross[0].length;
            crossH = cross.length;
            grid1.width(crossW * cellW);
            grid1.height(crossH * cellH);
            generateCrossword();
            generateHint();
        }, false);

        if (file) {
            reader.readAsText(file);
        }
    });

    function fillCross() {
        cross = [];
        for (var i = 0; i < crossH; i++) {
            cross[i] = [];
            for (var j = 0; j < crossW; j++) {
                cross[i][j] = 0;
            }
        }
    }

    $(document).on('mousedown', '.grid--1__item', function (e) {

        e.preventDefault();

        if (e.button === 0) {

            if (cross[$(this).data('row')] === undefined) {
                cross[$(this).data('row')] = [];
            }

            is_dragging = true;

            $(this).removeClass('cn');

            if ($(this).hasClass('cb')) {
                is_filled = true;
                cross[$(this).data('row')][$(this).data('col')] = 0;
                $(this).removeClass('cb');
            } else {
                is_filled = false;
                cross[$(this).data('row')][$(this).data('col')] = 1;
                $(this).addClass('cb');
            }
        }
    });

    $(document).on('mousedown', '.grid--2 span', function (e) {
        $(this).toggleClass('cn');
        hint.w[$(this).data('row')][$(this).data('col')] *= -1;

    });

    $(document).on('mousedown', '.grid--3 span', function (e) {
        $(this).toggleClass('cn');
        hint.h[$(this).data('col')][$(this).data('row')] *= -1;
    });


    $(document).on('contextmenu', '.grid--1__item', function (e) {

        e.preventDefault();

        if (cross[$(this).data('row')] === undefined) {
            cross[$(this).data('row')] = [];
        }

        $(this).removeClass('cb');
        $(this).toggleClass('cn');
        if ($(this).hasClass('cn')) {
            cross[$(this).data('row')][$(this).data('col')] = -1;
        }
        else {
            cross[$(this).data('row')][$(this).data('col')] = 0;
        }
        return false;
    });

    $(document).on('mouseup', '.grid--1__item', function () {
        is_dragging = false;
    });

    $(document).on('mousemove', '.grid--1__item', function (e) {

        if (is_dragging && curEl !== $(this).index()) {

            if (!erase) {
                $(this).addClass('cb');
            } else {
                $(this).removeClass('cb');
            }

            $(this).removeClass('cn');

            if (cross[$(this).data('row')] === undefined) {
                cross[$(this).data('row')] = [];
            }

            if ($(this).hasClass('cb')) {
                cross[$(this).data('row')][$(this).data('col')] = 1
            } else {
                cross[$(this).data('row')][$(this).data('col')] = 0
            }
        }

        if (true) {
            $('.grid--2 span, .grid--3 span').removeClass('highlightHints');
            $('.grid--2 span[data-row="' + $(this).data('row') + '"]').addClass('highlightHints');
            $('.grid--3 span[data-col="' + $(this).data('col') + '"]').addClass('highlightHints');
        }

        curEl = $(this).index();
    });

    $(document).on('click', '.btn-clean', function () {
        $('.grid--1__item').removeClass('cb');
        $('.grid__item').removeClass('cn');

        hint.w.forEach(function (items, i) {
            items.forEach(function (item, j){
                hint.w[i][j] = Math.abs(hint.w[i][j]);
            })
        })
        hint.h.forEach(function (items, i) {
            items.forEach(function (item, j){
                hint.h[i][j] = Math.abs(hint.h[i][j]);
            })
        })
        fillCross();
    });


    $(document).on('click', '.btn-success', function () {
        try {
            for (var i = 0; i < crossH; i++) {
                for (var j = 0; j < crossW; j++) {
                    curVal = cross[i][j] != -1 ? cross[i][j] : 0;
                    if(curVal != crossImported.solveCrossData[i][j]) {
                        loli;
                    }
                }
            }
            alert("Кросворд решен верно!");
        } catch {
            alert("Кросворд решен неверно!");
        }
    });

    $(document).on('click', '.btn-save', function () {
        crossExport = {
            crossData: cross,
            solveCrossData: crossImported.solveCrossData,
            hintData: crossImported.hintData,
            name: crossImported.name,
            started: true
        }
        downloadAsFile(JSON.stringify(crossExport));
    });

    function downloadAsFile(data) {
        let a = document.createElement("a");
        let file = new Blob([data], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = crossImported.name + " (в процессе решения)" +".crs";
        a.click();
    }

    function generateCrossword() {

        grid1.css({
            'grid-template': 'repeat(' + crossH + ', ' + 100 / crossH + '%)/repeat(' + crossW + ', ' + 100 / crossW + '%)'
        });

        crossC = crossW * crossH;

        $('.grid__item').remove();

        let $class = [];

        for (let i = 0; i < crossH; i++) {
            for (let j = 0; j < crossW; j++) {

                $class = [];

                if (cross[i][j] === 1) {
                    $class.push('cb');
                }

                if (cross[i][j] === -1) {
                    $class.push('cn');
                }

                if (j === 0) {
                    $class.push('blb');
                }

                if (i === 0) {
                    $class.push('btb');
                }

                if (j % 5 === 4 || j + 1 === crossW) {
                    $class.push('brb');
                }

                if (i % 5 === 4 || i + 1 === crossH) {
                    $class.push('bbb');
                }

                grid1.append('<span class="grid__item  grid--1__item grid__item--' + i + ($class.length > 0 ? ' ' + $class.join(' ') : '') + '" data-col="' + j + '" data-row="' + i + '"></span>');
            }
        }
    }

    function generateHint() {

        grid2.width(0).height(0).find('.grid__item').remove();
        grid3.width(0).height(0).find('.grid__item').remove();

        let hW = hint.w[0].length,
            hH = hint.h[0].length;

        grid2.css({
            'grid-template': 'repeat(' + crossH + ', ' + 100 / crossH + '%)/repeat(' + hW + ', ' + 100 / hW + '%)',
            'left': '-' + hW * cellW + 'px'
        }).width(hW * cellW).height(crossH * cellH);

        for (let i = 0; i < crossH; i++) {
            for (let j = 0; j < hW; j++) {

                $class = [];
                if (hint.w[i][j] < 0) {
                    $class.push('cn');
                }

                grid2.append('<span class="grid__item grid__item--' + j + ($class.length > 0 ? ' ' + $class.join(' ') : '')
                    + '" data-col="' + j + '" data-row="' + i + '"></span>');
            }
        }

        grid3.css({
            'grid-template': 'repeat(' + hH + ', ' + 100 / hH + '%)/repeat(' + crossW + ', ' + 100 / crossW + '%)',
            'top': '-' + hH * cellH + 'px'
        }).height(hH * cellH).width(crossW * cellW);


        $('.grid-wrap').css({
            'padding-top': hH * cellH + 'px',
            //'padding-left': hW * cellW + 'px',
            //'height': (cross.length + hH) * cellH + 'px',
            'width': (cross[0].length + hW) * cellW + 'px'
        });

        $item = 1;
        for (let j = 0; j < hH; j++) {
            for (let i = 0; i < crossW; i++) {

                $class = [];
                if (hint.h[i][j] < 0) {
                    $class.push('cn');
                }

                grid3.append('<span class="grid__item grid__item--' + $item + ($class.length > 0 ? ' ' + $class.join(' ') : '')
                    + '" data-col="' + i + '" data-row="' + j + '"></span>');

                $item++;
            }
        }

        for (let i = 0; i < crossW; i++) {

            for (let j = 0; j < hH; j++) {

                let value = (hint.h[i][j] !== undefined && hint.h[i][j] < 0 ? -hint.h[i][j] : (hint.h[i][j] > 0 ? hint.h[i][j] : ''));
                grid3.find('.grid__item[data-col="' + i + '"][data-row="' + j + '"]').html(value);
            }
        }

        for (let i = 0; i < hW; i++) {

            for (let j = 0; j < crossH; j++) {

                let value = (hint.w[j][i] !== undefined && hint.w[j][i] < 0 ? -hint.w[j][i] : (hint.w[j][i] > 0 ? hint.w[j][i] : ''));
                grid2.find('.grid__item[data-col="' + i + '"][data-row="' + j + '"]').html(value);
            }
        }

        if ($('#crossword-crossword').length > 0) {
            $('#crossword-crossword').val(JSON.stringify(cross));
        }

        if ($('#crossword-hints').length > 0) {
            var newHint = [];
            newHint.push(hint.w);
            newHint.push(hint.h);
            $('#crossword-hints').val(JSON.stringify(newHint));
        }

        // html2canvas(document.querySelector(".grid-crossword-screen")).then(canvas => {
        //     $('.crossword-screenshot').html(canvas);
        //     crossCanvas = canvas;
        // });
    }
});
