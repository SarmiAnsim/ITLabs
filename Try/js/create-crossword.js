$(function () {
    let cellW = 18,
        cellH = 18,
        crossW = 5,
        crossH = 5,
        crossC,
        grid1 = $('.grid--1'),
        grid2 = $('.grid--2'),
        grid3 = $('.grid--3'),
        cross = {},
        hint = {
            w: [],
            h: []
        },
        // crossCanvas,
        is_dragging = false,
        curEl = -1,
        erase = false;

    fillCross();
    generateCrossword();

    $('#cWidth, #crossword-width').change(function () {
        if (!parseInt($(this).val()))
            $(this).val(0);
        crossW = parseInt($(this).val());
        grid1.width(crossW * cellW);
        fillCross();
        generateCrossword();
        generateHint();
    });

    $('#cHeight, #crossword-height').change(function () {
        if (!parseInt($(this).val()))
            $(this).val(0);
        crossH = parseInt($(this).val());
        grid1.height(crossH * cellH);
        fillCross();
        generateCrossword();
        generateHint();
    });

    // $('#crossword-screenshot-download').click(function () {
    //     let a = document.createElement("a");
    //     a.href = crossCanvas.toDataURL("image/jpeg");
    //     a.download = $('#cName').val() + ".jpg";
    //     a.click();
    // });

    $('#crossword-download').click(function () {
        crossD = [];
        for (let i = 0; i < crossH; i++) {
            crossD[i] = [];
            for (let j = 0; j < crossW; j++) {
                crossD[i][j] = 0;
            }
        }
        crossExport = {
            crossData: crossD,
            solveCrossData: cross,
            hintData: hint,
            name: $('#cName').val(),
            started: false
        }
        downloadAsFile(JSON.stringify(crossExport));
    });

    function downloadAsFile(data) {
        let a = document.createElement("a");
        let file = new Blob([data], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = $('#cName').val() + ".crs";
        a.click();
    }

    function fillCross() {
        cross = [];
        for (let i = 0; i < crossH; i++) {
            cross[i] = [];
            for (let j = 0; j < crossW; j++) {
                cross[i][j] = 0;
            }
        }
        //console.log('Заполнение массива пустыми значениями', cross);
    }

    $('#crossword-ivert').click(function () {
        for (let i = 0; i < crossH; i++) {
            for (let j = 0; j < crossW; j++) {
                cross[i][j] = (cross[i][j] + 1)%2;
            }
        }
        generateCrossword();
        generateHint();
        $(this).toggleClass('btn-light');
        $(this).toggleClass('btn-dark');
    });

    $(document).on('mousedown', '.grid--1__item', function () {
        is_dragging = true;
        if ($(this).hasClass('cb')) {
            erase = true;
        } else {
            erase = false;
        }
    });

    $(document).on('mouseup', '.grid--1__item', function () {
        is_dragging = false;
        generateHint();
    });

    $(document).on('mousemove', '.grid--1__item', function (e) {
        if (is_dragging && curEl !== $(this).index()) {
            if (!erase) {
                $(this).addClass('cb');
            } else {
                $(this).removeClass('cb');
            }
            if (cross[$(this).data('row')] === undefined) {
                cross[$(this).data('row')] = {};
            }
            if ($(this).hasClass('cb')) {
                cross[$(this).data('row')][$(this).data('col')] = 1
            } else {
                cross[$(this).data('row')][$(this).data('col')] = 0
            }
        }
        curEl = $(this).index();
    });

    $(document).on('mousedown', '.grid--1__item', function () {
        $(this).toggleClass('cb');
        if (cross[$(this).data('row')] === undefined) {
            cross[$(this).data('row')] = {};
        }
        if ($(this).hasClass('cb')) {
            cross[$(this).data('row')][$(this).data('col')] = 1
        } else {
            cross[$(this).data('row')][$(this).data('col')] = 0
        }

        //generateHint();
    });

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

        hint = {
            w: [],
            h: []
        };

        let hintNum = 0,
            arrW = [],
            arrH = [],
            hW = 0,
            hH = 0;


        for (let i = 0; i < crossH; i++) {

            if (arrW[i] === undefined) {
                arrW[i] = [];
            }

            for (let j = 0; j < crossW; j++) {

                if (cross[i] !== undefined && cross[i][j] !== undefined && cross[i][j] === 1) {
                    hintNum++;
                }

                if (cross[i] === undefined || cross[i][j] === undefined || cross[i][j] === 0 || j + 1 === crossW) {
                    if (hintNum > 0) {
                        arrW[i].push(hintNum)
                    }
                    hintNum = 0;
                }
            }

            if (arrW[i].length > hW) {
                hW = arrW[i].length;
            }
        }

        for (let i = 0; i < crossH; i++) {

            for (let j = 0; j < hW; j++) {
                if (arrW[i] === undefined || arrW[i][j] === undefined) {
                    arrW[i].unshift(0);
                }
            }
        }

        hint.w = arrW;
        arrH = [];

        for (let i = 0; i < crossW; i++) {

            if (arrH[i] === undefined) {
                arrH[i] = [];
            }

            for (let j = 0; j < crossH; j++) {

                if (cross[j] !== undefined && cross[j][i] !== undefined && cross[j][i] === 1) {
                    hintNum++;
                }

                if (cross[j] === undefined || cross[j][i] === undefined || cross[j][i] === 0 || j + 1 === crossH) {
                    if (hintNum > 0) {
                        arrH[i].push(hintNum)
                    }
                    hintNum = 0;
                }
            }

            if (arrH[i].length > hH) {
                hH = arrH[i].length;
            }
        }

        for (let i = 0; i < crossW; i++) {

            for (let j = 0; j < hH; j++) {
                if (arrH[i] === undefined || arrH[i][j] === undefined) {
                    arrH[i].unshift(0);
                }
            }
        }

        hint.h = arrH;

        grid2.css({
            'grid-template': 'repeat(' + crossH + ', ' + 100 / crossH + '%)/repeat(' + hW + ', ' + 100 / hW + '%)',
            'left': '-' + hW * cellW + 'px'
        }).width(hW * cellW).height(crossH * cellH);

        for (let i = 0; i < crossH; i++) {
            for (let j = 0; j < hW; j++) {

                $class = [];

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
            'padding-left': hW * cellW + 'px'
        });

        $item = 1;
        for (let j = 0; j < hH; j++) {
            for (let i = 0; i < crossW; i++) {

                $class = [];

                grid3.append('<span class="grid__item grid__item--' + $item + ($class.length > 0 ? ' ' + $class.join(' ') : '')
                    + '" data-col="' + i + '" data-row="' + j + '"></span>');

                $item++;
            }
        }

        for (let i = 0; i < crossW; i++) {

            for (let j = 0; j < hH; j++) {

                let value = (hint.h[i][j] !== undefined && hint.h[i][j] > 0 ? hint.h[i][j] : '');
                grid3.find('.grid__item[data-col="' + i + '"][data-row="' + j + '"]').html(value);
            }
        }

        for (let i = 0; i < hW; i++) {

            for (let j = 0; j < crossH; j++) {

                let value = (hint.w[j][i] !== undefined && hint.w[j][i] > 0 ? hint.w[j][i] : '');
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