
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
	name: "Гранитный щебень фр. 2-5 мм(белый)",
	price: 950,
	quantity: 12,
	weight: 25
	},
	{
	id: 3,
	name: "Гравийный щебень фр. 2-5 мм(вайт)",
	price: 1268,
	quantity: 15,
	weight: 25
	},
	{
	id: 4,
	name: "Лом щебень фр. 2-5 мм, возврат",
	price: 1538,
	quantity: 26,
	weight: 25
	},
	{
	id: 5,
	name: "БигБэг Мраморный щебень фр. 2-5 мм",
	price: 102365,
	quantity: 15,
	weight: 1000
	}
]



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
// При открытии выпадающего меню активная вкладка остается, т.к. пользователь может находится на ней, и открыть дропменю посммотреть
// Есть возможность открыть все дополнительные меню
const items = document.querySelectorAll(".nav__btn-drop");
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

// Добавление новой строки в таблицу
$addBtn.addEventListener('click', ()=> {
	const lastId = $tableBody.lastElementChild.id	
	const $newTr = createTr(+lastId+1, +lastId+1)
	$newTr.setAttribute('id', +lastId+1)
	$tableBody.append($newTr)
	
	const $dropSearch = $newTr.querySelector('.products__list')
	$dropSearch.addEventListener('click', el => {
		updatePosition(el.target)
		$dropSearch.classList.remove('products__list--active')
	})
		totalCalc()
		changeInputs()
})
// действия с таблицей
$tableBody.addEventListener('click', (e)=> {
	// Удаление
	if (e.target.classList.contains('tr__btn-action')) {
		e.target.nextElementSibling.classList.toggle('delete--active')
	}
	if (e.target.classList.contains('delete')) {
		const orders = JSON.parse(localStorage.getItem('order'))
		const ordersCopy = [...orders]
		ordersCopy.forEach(el => {
			if (+e.target.parentNode.parentNode.parentNode.getAttribute('id') === +el.id) {
				e.target.parentNode.parentNode.parentNode.remove()
			}
			saveOrders()
		})
		 renderTable()
	}
	// Изменение полей
	if (e.target.classList.contains('tr__input-name') ) {
		const dropSearch = e.target.nextElementSibling
		dropSearch.addEventListener('click', e => {
			updatePosition(e.target);
		})
	}

})

const updatePosition = (elem)=> {
	dataBase.forEach(item=> {

		if (item.id === +elem.id.replace(/[^\d]/g, '')) {
			
			const tr = elem.parentNode.parentNode.parentNode.parentNode
			tr.querySelector('.tr__input-title').value = item.name
			tr.querySelector('.tr__input-quantity').value = item.quantity
			tr.querySelector('.tr__input-price').value = item.price
			tr.querySelector('.tr__input-name').value = `${item.name},${item.weight >=1000 ? item.weight / 1000 + ' тн': item.weight + ' кг'}`
			tr.querySelector('.tr__input-name').dataset.weight =  item.weight

			tr.querySelector('.tr__input-total').value = item.price * item.quantity
		}
	
	})
	saveOrders()
	totalCalc()
}

const saveOrders =()=> {

	const items = $tableBody.querySelectorAll('tr')
	let countOrders=[];
	items.forEach(el=> {
		const order = {
			
			id: +el.id,
			name: el.querySelector('.tr__input-title').value,
			price: +el.querySelector('.tr__input-price').value,
			quantity: +el.querySelector('.tr__input-quantity').value,
			weight: +el.querySelector('.tr__input-name').dataset.weight,

		}
		countOrders.push(order)

	})
	localStorage.setItem('order', JSON.stringify(countOrders));
}

// Создаем строчки из базы данных
const createTr = ( id, num)=> {
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
	$tdId.dataset.tableCol = 1
	$tdAction.dataset.tableCol = 2
	$tdName.dataset.tableCol = 3
	$tdPrice.dataset.tableCol = 4
	$tdQuantity.dataset.tableCol = 5
	$tdTitle.dataset.tableCol = 6
	$tdTotal.dataset.tableCol = 7
	$tdId.innerHTML = `<div class='tr__id-wrapper '>
							<button class='tr__btn-drag'></button>
							<p class='tr__id' id='${id}'>${num}</p>
						</div>`
	$tdAction.innerHTML = `<div class="action__wrapper ">
		<button class='tr__btn-action'></button>
		<button class="delete cell__wrapper">Удалить</button>
	</div>`;


	$tdName.innerHTML = `<div class='label__name'>
		<input class='tr__input-name cell__wrapper'
		/>
		<ul class='products__list products__list--active cell__wrapper'>
			<li class='product__item' id='product1'>${dataBase[0].name}</li>
			<li class='product__item' id='product2'>${dataBase[1].name}</li>
			<li class='product__item' id='product3'>${dataBase[2].name}</li>
			<li class='product__item' id='product4'>${dataBase[3].name}</li>
			<li class='product__item' id='product5'>${dataBase[4].name}</li>
		</ul>
	</div>` 
	
	$tdPrice.innerHTML = `<input class='tr__input-price cell__wrapper' type='number'  />` 
	$tdQuantity.innerHTML = `<input class='tr__input-quantity cell__wrapper' type='number'  />` 
	$tdTitle.innerHTML = `<input class='tr__input-title cell__wrapper' />`  
	$tdTotal.innerHTML = `<input class='tr__input-total cell__wrapper' type='number' />`  
	let currentCol = localStorage.getItem('currentCol')
	currentCol = JSON.parse(currentCol)
	const tdArr = [$tdId,$tdAction,$tdName,$tdPrice,$tdQuantity,$tdTitle,$tdTotal]	
	if (currentCol) {
		currentCol.forEach(el => {
			for (let i = 0; i < tdArr.length; i++) {
				if (+el === +tdArr[i].dataset.tableCol) {
					$tr.append(tdArr[i])
				}
			}
		})
	} else {
		$tr.append($tdId,
			$tdAction,
			$tdName,
			$tdPrice,
			$tdQuantity,
			$tdTitle,
			$tdTotal)
	}
	

		return $tr
}
// калькуляция в итоговую таблицу
const totalCalc = ()=> {
	const $trs = document.querySelectorAll('.table__tr')

	let totalSum = 0;
	let totalQuantity = 0;
	let totalWeight = 0;
	$trs.forEach(el => {
		const test = +el.querySelector('.tr__input-name')
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
		const $nameWrapper = el.querySelector('.label__name')
		const $inputName = el.querySelector('.tr__input-name')
		
		$inputName.addEventListener('focus', el => {
			el.target.nextElementSibling.classList.add('products__list--active')
			el.target.nextElementSibling.addEventListener('click', elem => {
			dataBase.forEach(item=> {
					if (item.id === +elem.target.id[elem.target.id.length -1]) {
						const tr = el.target.parentNode.parentNode.parentNode
						tr.querySelector('.tr__input-name').value = item.name
						tr.querySelector('.tr__input-quantity').value = item.quantity
						tr.querySelector('.tr__input-price').value = item.price
					}
				
					})
				})
			})
		$inputName.addEventListener('blur', el => {
			el.target.nextElementSibling.classList.remove('products__list--active')
			})
		$inputName.addEventListener('input',(el) => {
			let val = el.target.value.trim()
			el.target.nextElementSibling.querySelectorAll('li')
			if (val !== '') {
				el.target.nextElementSibling.querySelectorAll('li').forEach(elem => {
					if (elem.innerText.toLowerCase().search(val.toLowerCase())=== -1) {
						elem.classList.add('hide')
					} else {
						elem.classList.remove('hide')
					}
				
				})
			} else {
				el.target.nextElementSibling.querySelectorAll('li').forEach(elem => { 
					elem.classList.remove('hide')
				})
				
			}

			})
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
				saveOrders()
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
				saveOrders()
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
const thead = document.getElementById('table__head')
const trHead = document.querySelectorAll('.thead')
let currentCol = localStorage.getItem('currentCol')
	currentCol = JSON.parse(currentCol)
thead.innerHTML = ''
if (currentCol) {
	currentCol.forEach(el=> {
		for (let i = 0; i < trHead.length; i++) {
		if (+el === +trHead[i].dataset.tableCol) {
			thead.append(trHead[i])
		}
		}
	})
}

	$tableBody.innerHTML = ''
	const order = localStorage.getItem('order')
	let num = 0
	let id = 0
	
	JSON.parse(order).forEach((el)=> {	

		const $newTr = createTr(id+1, num+1)
		$newTr.setAttribute('id', id+1)
		num++
		id++
		$newTr.querySelector('.products__list').classList.remove('products__list--active')
		$newTr.querySelector('.tr__input-name').value = `${el.name},${el.weight >=1000 ? el.weight / 1000 + ' тн': el.weight + ' кг'}`
		$newTr.querySelector('.tr__input-name').dataset.weight = el.weight
		$newTr.querySelector('.tr__input-price').value = el.price
		$newTr.querySelector('.tr__input-quantity').value = el.quantity
		$newTr.querySelector('.tr__input-title').value = el.name
		$newTr.querySelector('.tr__input-total').value = el.price * el.quantity
		$tableBody.append($newTr)
	})
		num= 0
		id = 0
	totalCalc()
	changeInputs()
}

// открытие настроек
document.querySelectorAll('.btn__setting').forEach(el=> {
	el.addEventListener('click',ev=> {
		ev.currentTarget.classList.toggle('btn__setting--active')
		ev.currentTarget.nextElementSibling.classList.toggle('setting__list--active')
	})
})

const renderTabs = ()=> {
	const container = document.querySelector('.main__nav-list')
	const tabs = container.querySelectorAll('.main__nav-item')
	const tabsList = document.querySelectorAll('[data-select-tab]');
	const currentNum = localStorage.getItem('tabs')
	const test = JSON.parse(currentNum)
	if (currentNum !== null) {
		
		tabs.forEach(el => {
			test.forEach(num => {
				if (+el.dataset.tab === +num) {
					el.classList.add('main__nav-item--nonactive')
				} 
			})
			
		})
		tabsList.forEach(el=> {
			test.forEach(num => {
				if (+el.dataset.selectTab === +num) {
					el.checked = false
				} 
			})
		})
	}
}
renderTabs()
document.querySelector('.setting__list').addEventListener('click', (el)=> {
	switch (el.target.id) {
		case 'view':
			document.querySelector('.view__list').classList.toggle('view__list--active')
			
			const tabsList = document.querySelectorAll('[data-select-tab]');
				tabsList.forEach(el=> {
					const currentNum = localStorage.getItem('tabs')
					const test = JSON.parse(currentNum)
					if (currentNum !== null) {
						tabsList.forEach(el=> {
							test.forEach(num => {
								if (+el.dataset.selectTab === +num) {
									el.checked = false
								} 
							})
						})
					}
					let checkedEls = []
					el.addEventListener('change', inp => {
						document.querySelectorAll('.main__nav-item').forEach(elem=> {
							if (+inp.target.dataset.selectTab === +elem.dataset.tab) {
								inp.target.checked ? elem.classList.remove('main__nav-item--nonactive') : elem.classList.add('main__nav-item--nonactive')
							}
						})
						tabsList.forEach(checkedEl => {
							if (!checkedEl.checked) {
								checkedEls.push(checkedEl.dataset.selectTab)
							}
						})

						localStorage.setItem('tabs', JSON.stringify(checkedEls)) 
						checkedEls = []
					})
					
				})
				
			break;
		default:
			break;
	}
})

document.addEventListener('DOMContentLoaded', function () {
	sortDragableItems()
	renderTable()
	changeInputs()
	// Перемещение строк в талице
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
	.on('drop', function () {
		//Событие на перемещение элемента в контейнер
		// Перезаписываем данные каждый раз когда меняем порядок
		saveOrders()
		renderTable()

	})
	// перемещение в меню
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
        .on('drop', function () {
            //Событие на перемещение элемента в контейнер
			const $menuItems  = [...$navList.querySelectorAll('[data-menuid]')]
			
			let menuIds = [];
			// создаем массив порядковых номеров элементов в  меню, и сохраняем в локал сторидже.
			for (let i = 0; i < $menuItems.length; i++) {
				menuIds.push($menuItems[i].dataset.menuid)
			}
			// Перезаписываем данные каждый раз когда меняем порядок
			localStorage.setItem('setMenuItems', JSON.stringify(menuIds))

    })
	const table = document.getElementById('table');

	let draggingEle;
	let draggingColumnIndex;
	let placeholder;
	let list;
	let isDraggingStarted = false;

	// The current position of mouse relative to the dragging element
	let x = 0;
	let y = 0;

	// Swap two nodes
	const swap = function (nodeA, nodeB) {
		const parentA = nodeA.parentNode;
		const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

		// Move `nodeA` to before the `nodeB`
		nodeB.parentNode.insertBefore(nodeA, nodeB);

		// Move `nodeB` to before the sibling of `nodeA`
		parentA.insertBefore(nodeB, siblingA);
	};

	// Check if `nodeA` is on the left of `nodeB`
	const isOnLeft = function (nodeA, nodeB) {
		// Get the bounding rectangle of nodes
		const rectA = nodeA.getBoundingClientRect();
		const rectB = nodeB.getBoundingClientRect();

		return rectA.left + rectA.width / 2 < rectB.left + rectB.width / 2;
	};

	const cloneTable = function () {
		const rect = table.getBoundingClientRect();

		list = document.createElement('div');
		list.classList.add('clone-list');
		list.style.position = 'absolute';
		list.style.left = `0px`;
		list.style.top = `0px`;
		table.parentNode.insertBefore(list, table);

		// Hide the original table
		table.style.visibility = 'hidden';

		// Get all cells
		const originalCells = [].slice.call(table.querySelectorAll('tbody td'));

		const originalHeaderCells = [].slice.call(table.querySelectorAll('th'));
		const numColumns = originalHeaderCells.length;

		// Loop through the header cells
		originalHeaderCells.forEach(function (headerCell, headerIndex) {
			const width = parseInt(window.getComputedStyle(headerCell).width);

			// Create a new table from given row
			const item = document.createElement('div');
			item.classList.add('draggable');

			const newTable = document.createElement('table');
			newTable.setAttribute('class', 'clone-table');
			newTable.style.width = `${width}px`;
			
			// Header
			const th = headerCell.cloneNode(true);
			let newRow = document.createElement('tr');
			newRow.appendChild(th);
			newTable.appendChild(newRow);

			const cells = originalCells.filter(function (c, idx) {
				return (idx - headerIndex) % numColumns === 0;
			});
			cells.forEach(function (cell) {
				const newCell = cell.cloneNode(true);
				newCell.style.width = `${width}px`;
				newRow = document.createElement('tr');
				newRow.appendChild(newCell);
				newTable.appendChild(newRow);
			});

			item.appendChild(newTable);
			list.appendChild(item);

		});
	};

	const mouseDownHandler = function (e) {
		draggingColumnIndex = [].slice.call(table.querySelectorAll('th')).indexOf(e.target);

		// Determine the mouse position
		x = e.clientX - e.target.offsetLeft;
		y = e.clientY - e.target.offsetTop;

		// Attach the listeners to `document`
		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);
	};

	const mouseMoveHandler = function (e) {
		if (!isDraggingStarted) {
			isDraggingStarted = true;

			cloneTable();

			draggingEle = [].slice.call(list.children)[draggingColumnIndex];
			draggingEle.classList.add('dragging');

			// Let the placeholder take the height of dragging element
			// So the next element won't move to the left or right
			// to fill the dragging element space
			placeholder = document.createElement('div');
			placeholder.classList.add('placeholder');
			draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
			placeholder.style.width = `${draggingEle.offsetWidth}px`;
		}

		// Set position for dragging element
		draggingEle.style.position = 'absolute';
		draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
		draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;

		// Reassign the position of mouse
		x = e.clientX;
		y = e.clientY;

		// The current order
		// prevEle
		// draggingEle
		// placeholder
		// nextEle
		const prevEle = draggingEle.previousElementSibling;
		const nextEle = placeholder.nextElementSibling;

		if (prevEle && isOnLeft(draggingEle, prevEle)) {
			// The current order    -> The new order
			// prevEle              -> placeholder
			// draggingEle          -> draggingEle
			// placeholder          -> prevEle
			swap(placeholder, draggingEle);
			swap(placeholder, prevEle);
			return;
		}

		// The dragging element is below the next element
		// User moves the dragging element to the bottom
		if (nextEle && isOnLeft(nextEle, draggingEle)) {
			// The current order    -> The new order
			// draggingEle          -> nextEle
			// placeholder          -> placeholder
			// nextEle              -> draggingEle
			swap(nextEle, placeholder);
			swap(nextEle, draggingEle);
		}
	};

	const mouseUpHandler = function () {
			// // Remove the placeholder
			// placeholder && placeholder.parentNode.removeChild(placeholder);
			// draggingEle.classList.remove('dragging');
			// draggingEle.style.removeProperty('top');
			// draggingEle.style.removeProperty('left');
			// draggingEle.style.removeProperty('position');
			// Get the end index
			const endColumnIndex = [].slice.call(list.children).indexOf(draggingEle);
			
			isDraggingStarted = false;

			// Remove the `list` element
			list.parentNode.removeChild(list);

			// Move the dragged column to `endColumnIndex`
			table.querySelectorAll('tr').forEach(function (row) {
				const cells = [].slice.call(row.querySelectorAll('th, td'));
				draggingColumnIndex > endColumnIndex
					? cells[endColumnIndex].parentNode.insertBefore(
						cells[draggingColumnIndex],
						cells[endColumnIndex]
					)
					: cells[endColumnIndex].parentNode.insertBefore(
						cells[draggingColumnIndex],
						cells[endColumnIndex].nextSibling
					);
			});

			// Bring back the table
			table.style.removeProperty('visibility');

			// Remove the handlers of `mousemove` and `mouseup`
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
			let currentCols=[];
			document.querySelectorAll('.thead').forEach(el => {
				currentCols.push(+el.dataset.tableCol)
			})
				localStorage.setItem('currentCol', JSON.stringify(currentCols))

		};	

	

	table.querySelectorAll('th').forEach(function (headerCell) {
		headerCell.classList.add('draggable');
		headerCell.addEventListener('mousedown', mouseDownHandler);
	});
});
