// Создам ипровизированную БД, при загрузке страницы мы должны получить ответ от сервера с позициями и их свойствами. Здесь и должна быть функция запрос.
// здесь храняться, как я понимаю, дефолтные значения цены  и т.д. При изменении данных в инпутах мы должны отправлять данные на сервер, что бы хранить эту информацию.
// В нашем случае мы будем их хранить в localStorage 
const dataBase = [
	{
	id: 1,
	name: "Мраморный щебень фр. 2-5 мм",
	price: 1340,
	quantity: 7,
	weight: 25
	},
	{
	id: 2,
	name: "Мраморный щебень фр. 2-5 мм(белый)",
	price: 950,
	quantity: 12,
	weight: 25
	},
	{
	id: 3,
	name: "Мраморный щебень фр. 2-5 мм(вайт)",
	price: 1268,
	quantity: 15,
	weight: 25
	},
	{
	id: 4,
	name: "Мраморный щебень фр. 2-5 мм, возврат",
	price: 1538,
	quantity: 26,
	weight: 25
	},
	{
	id: 5,
	name: "Мраморный щебень фр. 2-5 мм",
	price: 102365,
	quantity: 15,
	weight: 1000
	}
]
// window.localStorage.removeItem('dataBase')
if (!localStorage.getItem('dataBase')) {
	localStorage.setItem('dataBase', JSON.stringify(dataBase));
}

const $navLink = document.querySelectorAll('.nav__item-link')
const $subnavLists = document.querySelectorAll('.subnav__list')
const $navList = document.getElementById('navList');
const $totalSum = document.getElementById('total__sum');
const $totalQuantity = document.getElementById('total__quantity');
const $totalWeight = document.getElementById('total__weight');
const $totalGlobSum = document.getElementById('total__glob');
const $addBtn  = document.querySelector('.add__btn'),
$table = document.getElementById('table'), 
$tableBody = $table.querySelector('tbody');




// сортируем 
const sortDragableItems = ()=> {
    const $menuItems  = [...$navList.querySelectorAll('[data-menuid]')]
    const currentMenuIds = JSON.parse(localStorage.getItem('setMenuItems'))
   

// Если данные о месте табов сохранены, то пользуемся ими, если нет рисуме дефолтное dom
if (currentMenuIds && currentMenuIds.length !== 0) {
    $navList.innerHTML = ''
    currentMenuIds.forEach(el=> {
        for (let i = 0; i < $menuItems.length; i++) {
            if (+el === +$menuItems[i].dataset.menuid) {
                $navList.append($menuItems[i])
            }
        }
    })
}

}
sortDragableItems()
const removeActiveLink = () => {
    $navLink.forEach(elem=> {
        elem.parentNode.classList.remove('active--link')
        elem.parentNode.classList.remove('active')
        elem.parentNode.lastElementChild.classList.remove('active')
    })
}

$navLink.forEach(e=> {
    e.addEventListener('click', ev => {
        // Здесь убрано стандартное поведение в данном котнексте. 
        // В реальной системе убирать его не надо, будем менять стиль активной вкладки исходя из URL
        ev.preventDefault()
        removeActiveLink()
        // При смене активной вкладке все дропменю закрываются 
        $subnavLists.forEach(e=> {
            e.classList.remove('active')
        })
        ev.target.parentNode.classList.add('active--link')
    })
})

// Выпадающий список в меню
const items = document.querySelectorAll(".nav__btn-drop");
// При открытии выпадающего меню активная вкладка остается, т.к. пользователь может находится на ней, и открыть дропменю посммотреть
// Есть возможность открыть все дополнительные меню

function toggleAccordion() {
    this.parentNode.classList.toggle('active')
    this.parentNode.nextElementSibling.classList.toggle('active')
    this.parentNode.lastElementChild.classList.toggle('active')
}
items.forEach(item => item.addEventListener('click', toggleAccordion));

const setUsersInfo = () => {
// асинхорнная функция получения данных пользователя для отображения имени, данных и аватара(либо дефолтного изображения) при входе в систему
}
// Всплывающее меню в футере меню
document.getElementById('account__btn').addEventListener('click',()=> {
    document.querySelector('.footer__drop').classList.toggle('drop-top')
})
// $('#logOut').onclick(async/await) Здусь будет запрос на сервер на завершение сессиии


let localBase = JSON.parse(localStorage.getItem('dataBase'));
// Добавление новой строки в таблицу
$addBtn.addEventListener('click', ()=> {
	let lastId = 0
	let lastNum = 0
	if ($tableBody.lastElementChild) {
		lastId = +$tableBody.lastElementChild.getAttribute('id')
		lastNum = +$tableBody.lastElementChild.textContent
		debugger
	} else {
		lastId
		lastNum
	}
	
	// При добавлении новой строки дефолтно устанавливаем значени из БД. в данном случае просто беру нулевой элемент массива
	const $newTr = createTr(dataBase[0], lastId + 1, lastNum+1)
	$newTr.setAttribute('id', lastId+1)
	$tableBody.append($newTr)

	const localBaseCopy = [...localBase, {...dataBase[0], id: lastId + 1}]
	
	localBase = [...localBaseCopy]
	
	for (let i = 0; i < localBaseCopy.length; i++) {
		localBaseCopy[i].id = i + 1	
	}

	localStorage.setItem('dataBase', JSON.stringify(localBaseCopy))

	totalCalc()
	changeInputs()
})
// Удаленние строки 
$tableBody.addEventListener('click', (e)=> {
	const currentTableIds = JSON.parse(localStorage.getItem('setTableItems'))
	if (e.target.classList.contains('tr__btn-action')) {

		const localBaseCopy = [...localBase]
		localBaseCopy.forEach(el => {
			if (+e.target.parentNode.parentNode.getAttribute('id') === +el.id) {
				
					const index = localBaseCopy.indexOf(el)
					localBaseCopy.splice(index,1)
					for (let i = 0; i < localBaseCopy.length; i++) {
						localBaseCopy[i].id = i + 1	
					}
					localStorage.setItem('dataBase', JSON.stringify(localBaseCopy))
					localBase = [...localBaseCopy]
					renderTable()
			}
		})

		let currentTableIdsCopy = [...currentTableIds]
		const $tableItems  = [...$tableBody.querySelectorAll('[data-table-id]')]
		for (let i = 0; i < $tableItems.length; i++) {
			$tableItems[i].setAttribute('id', i+1)
		}
		let tableIds = [];
		// создаем массив порядковых номеров элементов в  таблице, и сохраняем в локал сторидже.
		for (let i = 0; i < $tableItems.length; i++) {
			tableIds.push($tableItems[i].dataset.tableId)
		}
		// Перезаписываем данные каждый раз когда меняем порядок
		window.localStorage.setItem('setTableItems', JSON.stringify(tableIds))
		
	}

})

// Создаем строчки из базы данных
const createTr = (item, id, num)=> {
	const $tr = document.createElement('tr'),
	$tdId = document.createElement('td'),
	$tdAction = document.createElement('td'),
	$tdName = document.createElement('td'),
	$tdPrice = document.createElement('td'),
	$tdQuantity = document.createElement('td'),
	$tdTitle = document.createElement('td'),
	$tdTotal = document.createElement('td')
	$tr.classList.add('table__tr')
	$tr.dataset.tableId = id;

	$tdId.innerHTML = `<div class='tr__id-wrapper'>
							<button class='tr__btn-drag'></button>
							<p class='tr__id'>${num}</p>
						</div>`
	$tdAction.innerHTML = `<button class='tr__btn-action'></button>`;
	$tdName.innerHTML = `<input class='tr__input-name cell__wrapper' data-weight=${item.weight} value='${item.name},${item.weight >=1000 ? item.weight / 1000 + ' тн': item.weight + ' кг'}'/>`
	$tdPrice.innerHTML = `<input class='tr__input-price cell__wrapper' type='number' value='${item.price}' />`
	$tdQuantity.innerHTML = `<input class='tr__input-quantity cell__wrapper' type='number' value='${item.quantity}' />`
	$tdTitle.innerHTML = `<input class='tr__input-title cell__wrapper' value='${item.name}'/>`
	$tdTotal.innerHTML = `<input class='tr__input-total cell__wrapper' type='number' value='${item.price * item.quantity}'/>`
	$tr.append($tdId,
		$tdAction,
		$tdName,
		$tdPrice,
		$tdQuantity,
		$tdTitle,
		$tdTotal)

		return $tr
}
// калькуляция в итоговую таблицу
const totalCalc = ()=> {
	const $trs = document.querySelectorAll('.table__tr')
	let totalSum = 0;
	let totalQuantity = 0;
	let totalWeight = 0;
	$trs.forEach(el => {
		const totalCellSum = +el.querySelector('.tr__input-total').value
		const totalCellQuan = +el.querySelector('.tr__input-quantity').value
		const totalCellWeight = +el.querySelector('.tr__input-name').dataset.weight
		
		totalSum = totalSum + totalCellSum 
		totalQuantity = totalQuantity + totalCellQuan 
		totalWeight = totalWeight + totalCellWeight 
		
	})
	// Итоговая сумма всегда разделяется по разрядам, включая числа с плавающей точкой
	$totalSum.textContent = totalSum.toLocaleString() + ' руб'
	$totalQuantity.textContent = totalQuantity + ' шт'
	$totalWeight.textContent = totalWeight.toLocaleString() + ' кг'
	$totalGlobSum.textContent = totalSum.toLocaleString() + ' руб'
}
// изменение значение при изменении ввдных значений в цене и количестве. Остальные значения не стал прописывать в калькуляцию, потому что не до конца понимаю специфику.
// Например не понятно измнение веса. можно ли его менять в номенклатуре( в чем я сомневаюсь), думаю что 25кг это мешки, по тонне это бигбеги.
const changeInputs = ()=> {
	const $trs = document.querySelectorAll('.table__tr')
	$trs.forEach(el => {
		const $inputQuan = el.querySelector('.tr__input-quantity')
		const $inputPrice = el.querySelector('.tr__input-price')
		const $inputTotal = el.querySelector('.tr__input-total')
		

		$inputPrice.addEventListener('input', (e)=> {
				
				$inputTotal.value = $inputQuan.value * $inputPrice.value
				const localBaseCopy = [...localBase]
				localBaseCopy.forEach(item => {
					if (+e.currentTarget.parentNode.parentNode.getAttribute('id') === +item.id) {
						item.price = +$inputPrice.value
						localStorage.setItem('dataBase', JSON.stringify(localBaseCopy));
					}
				})
				
				totalCalc()
			})
		$inputQuan.addEventListener('input', (e)=> {
				$inputTotal.value = $inputQuan.value * $inputPrice.value
				const localBaseCopy = [...localBase]
				localBaseCopy.forEach(item => {
					if (+e.currentTarget.parentNode.parentNode.getAttribute('id') === +item.id) {
						item.quantity = +$inputQuan.value
						localStorage.setItem('dataBase', JSON.stringify(localBaseCopy));
					}
				})
				totalCalc()
			})

			// Решил добавить что бы при изменении инпута менялась стоимость, но не менялось кол-во. 
			// По опыту работы с нерудкой знаю, что иногда есть общая цена и объем/масса, и хочется получить цену за единицу, не залезая в калькулятор
			// Возможно, жто не понадобится на реальном проекте, но на данный момент я увидел такую потребность. даже если такая потребность имеет место, 
			// возможно, логика поведения будет другая
			$inputTotal.addEventListener('input', (e)=> {
				const test = $inputTotal.value / $inputQuan.value
				// про копейки тоже не забываем
				$inputPrice.value = test.toFixed(2)
				const localBaseCopy = [...localBase]
				localBaseCopy.forEach(item => {
					if (+e.currentTarget.parentNode.parentNode.getAttribute('id') === +item.id) {
						item.price = +$inputPrice.value
						localStorage.setItem('dataBase', JSON.stringify(localBaseCopy));
					}
				})
				totalCalc()
			})
		})
}

const renderTable = ()=> {
	$tableBody.innerHTML = ''


	const $tableItems  = [...$tableBody.querySelectorAll('[data-table-id]')]
    const currentTableIds = JSON.parse(localStorage.getItem('setTableItems'))
	// window.localStorage.removeItem('setTableItems')
	if (currentTableIds && currentTableIds.length !== 0) {
		$tableBody.innerHTML = ''
		let count = 0
		currentTableIds.forEach(el=> {
			debugger
			for (let i = 0; i < localBase.length; i++) {
				if (+el === +localBase[i].id) {
					const element = localBase[i];
					const $newTr = createTr(element, i+1, count + 1)
					count++
					$newTr.setAttribute('id', i+1)
					$tableBody.append($newTr)
				} else {
					for (let i = 0; i < localBase.length; i++) {
						const element = localBase[i];
						const $newTr = createTr(element, i+1, count + 1)
						count++	
						$newTr.setAttribute('id', i+1)
						$tableBody.append($newTr)
					}
				}
			}
		})
		} 

	
	totalCalc()
	changeInputs()
}

window.addEventListener('load', ()=> {
    
	dragula([document.getElementById('table__body')], {
        
        moves: function (el, source, handle, sibling) {
			
            if (handle.classList.contains('tr__btn-drag') ) {
            return true
            } else {
            return false
            }
         //задаем хэндлер для перетаскивания. по умолчанию элементы всегда можно перетаскивать
        }
		
	})
	.on('drop', function (el) {
		//Событие на перемещение элемента в контейнер
		const $tableItems  = [...$tableBody.querySelectorAll('[data-table-id]')]
		for (let i = 0; i < $tableItems.length; i++) {
			$tableItems[i].setAttribute('id', i+1)
			
		}
		let tableIds = [];
		// создаем массив порядковых номеров элементов в  таблице, и сохраняем в локал сторидже.
		for (let i = 0; i < $tableItems.length; i++) {
			tableIds.push($tableItems[i].dataset.tableId)
		}
		// Перезаписываем данные каждый раз когда меняем порядок
		window.localStorage.setItem('setTableItems', JSON.stringify(tableIds))
		renderTable()
	})

    dragula([document.getElementById('navList')], {
        
        moves: function (el, source, handle, sibling) {
            if (handle.classList.contains('nav__btn-drag') ) {
            return true
            } else {
            return false
            }
         //задаем хэндлер для перетаскивания. по умолчанию элементы всегда можно перетаскивать
        }
        })
        .on('drop', function (el) {
            //Событие на перемещение элемента в контейнер
			const $menuItems  = [...$navList.querySelectorAll('[data-menuid]')]
			
			let menuIds = [];
			// создаем массив порядковых номеров элементов в  меню, и сохраняем в локал сторидже.
			for (let i = 0; i < $menuItems.length; i++) {
				menuIds.push($menuItems[i].dataset.menuid)
			}
			// Перезаписываем данные каждый раз когда меняем порядок
			window.localStorage.setItem('setMenuItems', JSON.stringify(menuIds))

    })
    
	renderTable()
})



// Resize ширины колонок в таблице
const resizable = (elem, limitByParent ) => {
	const cornerElem = document.createElement("div");
	cornerElem.className = resizable.resizeCornerClass;
	elem.appendChild(cornerElem);
	// console.log(elem.getBoundingClientRect());

	elem.addEventListener("change", onChange);
	cornerElem.addEventListener("mousedown", onMouseDown);
	
	var startW;
	var startH;
	
	var startMouseX;
	var startMouseY;
	
	var compStyle;
	
	var parent;
	var parentW;
	var parentH;
	var parentCompStyle;
	var limited;
	
	function getStylePixels( style, prop ) {
		return parseFloat(style.getPropertyValue(prop).replace(/px/gi, ""))
	}
	
	function refresh() {
		compStyle = window.getComputedStyle(elem, null);
		parent = elem.parentNode;
		limited = limitByParent;
		if (limited === undefined && parent) {
			limited = parent.classList.contains(resizable.resizeLimiterClass);
		}
		if (parent) {
			parentCompStyle = window.getComputedStyle(parent, null);
			parentW = parent.offsetWidth;
			parentH = parent.offsetHeight;
		}
	}
	
	function setSize( w, h ) {
		if (limited) {
			var wMax = parentW - elem.offsetLeft;
			var hMax = parentH - elem.offsetTop;
			
			w = (w > wMax) ? wMax : w;
			h = (h > hMax) ? hMax : h;
		}
		
		w -= getStylePixels(compStyle, "padding-left");
		w -= getStylePixels(compStyle, "padding-right");
		
		h -= getStylePixels(compStyle, "padding-top");
		h -= getStylePixels(compStyle, "padding-bottom");
		
		w = (w < 0) ? 0 : w;
		h = (h < 0) ? 0 : h;
		
		elem.style.width = w + "px";
		// elem.style.height = h + "px";
	}
	
	function dispatchChanged() {
		var evt = document.createEvent("Event");
		evt.initEvent("change", true, false);
		var children = elem.childNodes;
		var i = children.length;
		while (i--) {
			var child = children[i];
			child.dispatchEvent(evt);
		}
		elem.dispatchEvent(evt);
	}
	
	function onMouseDown( e ) {
		e.stopPropagation();
		
		refresh();
		
		startW = elem.offsetWidth;
		startH = elem.offsetHeight;
		
		startMouseX = e.screenX;
		startMouseY = e.screenY;
		
		document.addEventListener("mouseup", onMouseUp);
		document.addEventListener("mousemove", onMouseMove);
	}
	
	function onMouseUp( e ) {
		onMouseMove(e);
		
		document.removeEventListener("mouseup", onMouseUp);
		document.removeEventListener("mousemove", onMouseMove);
	}
	
	function onMouseMove( e ) {
		var w = startW + e.screenX - startMouseX;
		var h = startH + e.screenY - startMouseY;
		setSize(w, h);
		dispatchChanged();
	}
	
	function onChange( e ) {
		refresh();
		setSize(elem.offsetWidth, elem.offsetHeight);
	}
}

resizable.resizableClass = "js-resizable";
resizable.resizeLimiterClass = "js-resizable-limiter";
resizable.resizeCornerClass = "js-resizable-corner";

resizable.init = function() {
	var arr = document.querySelectorAll("." + resizable.resizableClass);
	var i = -1;
	var l = arr.length;
	while (++i < l) {
		resizable(arr[i]);
	}
}

resizable.initOnDocumentReady = function() {
	document.addEventListener("DOMContentLoaded", resizable.init);
}
resizable.initOnDocumentReady();
