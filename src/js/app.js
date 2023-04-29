
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
const $navLink = document.querySelectorAll('.nav__item-link'),
$subnavLists = document.querySelectorAll('.subnav__list'),
$navList = document.getElementById('navList'),
$totalSum = document.getElementById('total__sum'),
$totalQuantity = document.getElementById('total__quantity'),
$totalWeight = document.getElementById('total__weight'),
$totalGlobSum = document.getElementById('total__glob'),
$addBtn  = document.querySelector('.add__btn'),
$table = document.getElementById('table'), 
$tableBody = $table.querySelector('tbody'),
$saveBtnChange = document.querySelector('.save__change-btn')
const items = document.querySelectorAll(".nav__btn-drop");

// МЕНЮ

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
// открываем/закрываем меню
document.getElementById('menuOpen').addEventListener('click', (e)=> {
	e.currentTarget.classList.add('open')
	document.querySelector('.menu').classList.toggle('menu--active')
})
document.getElementById('menuClose').addEventListener('click', (e)=> {
	document.getElementById('menuOpen').classList.remove('open')
	document.querySelector('.menu').classList.toggle('menu--active')
})
// Контроль активной вкладки
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
function toggleAccordion() {
    this.parentNode.classList.toggle('active')
    this.parentNode.nextElementSibling.classList.toggle('active')
    this.parentNode.lastElementChild.classList.toggle('active')
}
items.forEach(item => item.addEventListener('click', toggleAccordion));
// Всплывающее меню в футере меню
document.getElementById('account__btn').addEventListener('click',()=> {
    document.querySelector('.footer__drop').classList.toggle('drop-top')
})

// НАСТРОЙКИ
// открытие настроек
document.querySelectorAll('.btn__setting').forEach(el=> {
	el.addEventListener('click',ev=> {
		ev.currentTarget.classList.toggle('btn__setting--active')
		ev.currentTarget.nextElementSibling.classList.toggle('setting__list--active')
	})
})

// рендер верхних вкладок, селектов и пертаскивалок
const renderTabs = ()=> {
	const container = document.querySelector('.main__nav-list')
	const tabs = container.querySelectorAll('.main__nav-item')
	const tabsList = document.querySelectorAll('[data-select-tab]');
	const priorityList = document.querySelectorAll('[data-priority-tab]')
	const currentNum = localStorage.getItem('tabs')


	const test = JSON.parse(currentNum)
		
	if (currentNum !== null) {

		test.forEach(num => {
		
			tabs.forEach(el=> {
				if (+num === +el.dataset.tab) {
					
					container.append(el)
				}
			})
		})


		tabs.forEach(el => {
			test.forEach(num => {
				if (+el.dataset.tab === +num) {
					el.classList.add('main__nav-item--active')
				} 
			})
			
		})
		tabsList.forEach(el=> {
			test.forEach(num => {
				if (+el.dataset.selectTab === +num) {
					el.checked = true
				} 
			})
			priorityList.forEach(elem=> {
				if (+el.dataset.selectTab === +elem.dataset.priorityTab) {
					el.checked ? elem.style.display = 'block' : elem.style.display = 'none'
				}
			})
		})

	}
}
const renderCols = ()=> {
	const table = document.getElementById('table')
	const cols = document.querySelectorAll('[data-table-col]')
	const selectCols = document.querySelectorAll('[data-select-table-tab]');
}
document.querySelectorAll('.setting__list').forEach(el=> {

	el.addEventListener('click', (el)=> {
		switch (el.target.id) {
			case 'view':
				document.querySelector('.view__list').classList.toggle('view__list--active')
				
				const tabsList = document.querySelectorAll('[data-select-tab]');
					tabsList.forEach(el=> {
						const currentNum = localStorage.getItem('tabs')
						const test = JSON.parse(currentNum)
						if (currentNum !== null) {
							tabsList.forEach(ele=> {
								test.forEach(num => {
									if (+ele.dataset.selectTab === +num) {
										ele.checked = true
									} 
								})
							})
						} else {
							el.checked = true
						}
						let checkedEls = []
						el.addEventListener('change', inp => {
							document.querySelectorAll('.main__nav-item').forEach(elem=> {
								if (+inp.target.dataset.selectTab === +elem.dataset.tab) {
									inp.target.checked ? elem.classList.add('main__nav-item--active') : elem.classList.remove('main__nav-item--active')
								}
							})
							document.querySelectorAll('[data-priority-tab]').forEach(elem=> {
								if (+inp.target.dataset.selectTab === +elem.dataset.priorityTab) {
									inp.target.checked ? elem.style.display = 'block' : elem.style.display = 'none'
								}
							})
	
							tabsList.forEach(checkedEl => {
								if (checkedEl.checked) {
									checkedEls.push(checkedEl.dataset.selectTab)
								}
							})
	
							localStorage.setItem('tabs', JSON.stringify(checkedEls)) 
							checkedEls = []
	
							renderTabs()
						})
						
					})
					
				break;
			case 'sort': 
			const container = document.querySelector('.sort__list')
			container.classList.toggle('sort__list--active')
			const activeSorting = JSON.parse(localStorage.getItem('tabs'))

				container.querySelectorAll('.sort__el').forEach(elem => {
					activeSorting.forEach(i=> {
					if (+elem.dataset.priorityTab === +i) {
						elem.style.display = 'block'
					} 
				})
			})
			break;
			case 'table__view':
					el.target.lastElementChild.classList.toggle('view__list--active')
					const selectTabs = document.querySelectorAll('[data-select-table-tab]');
					selectTabs.forEach(inp=> {
						
					})
				break;
			case 'table__sort':
				el.target.lastElementChild.classList.toggle('sort__list--active')
				el.target.lastElementChild.innerHTML = ''
				dropCurrentCols()
			break;
				default:
				break;
		}
	})
})
const dropCurrentCols = ()=> {
	const colsName = {
		1: 'Номер строки',
		2: 'Действия',
		3: 'Наименование единицы',
		4: 'Цена',
		5: 'Кол-во',
		6: 'Название товара',
		7: 'Итого',
	}
const container = document.getElementById('table__sort').querySelector('.sort__list')	
const currentCol = JSON.parse(localStorage.getItem('currentCol'))
if (currentCol === null) {
	for (let key in colsName) {

		const item = document.createElement('li')
		item.setAttribute('data-priority-table-tab', key)
		item.classList.add('sort__el')
		const btn = document.createElement('button')
		btn.classList.add('sort__btn-drag')
		item.prepend(btn)
		item.append(colsName[key])
		container.append(item)
	}
} else {

currentCol.forEach(el => {

	for (let key in colsName) {
		if (+key === +el) {
			const item = document.createElement('li')
			item.setAttribute('data-priority-table-tab', key)
			item.classList.add('sort__el')
			const btn = document.createElement('button')
			btn.classList.add('sort__btn-drag')
			item.prepend(btn)
			item.append(colsName[key])
			container.append(item)
		}
		
	}
});

	
}

}
const sortTabs = ()=> {
	const tabs = document.querySelectorAll('[data-priority-tab]')
	let clearTabs = []
	tabs.forEach(el=> {
		if (!el.classList.contains('gu-mirror')) {
			if (el.style.display !== "none") {
				clearTabs.push(el)
			}
		}
	})
	clearTabs = clearTabs.map(el => {
		return el.dataset.priorityTab
	})
	localStorage.setItem('tabs', JSON.stringify(clearTabs)) 
}

// ТАБЛИЦА
// СОЗДАНИЕ И ДОБАВЛЕНИЕ 
const renderTable = ()=> {
	const thead = document.getElementById('table__head')
	const trHead = document.querySelectorAll('.thead')
	let currentCol = localStorage.getItem('currentCol')
		currentCol = JSON.parse(currentCol)
	
	if (currentCol) {
		thead.innerHTML = ''
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
		const countOrder = JSON.parse(order)
		if (countOrder !== null) {
			countOrder.forEach((el)=> {	
	
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
		}
		const table = document.getElementById('table')
		if (localStorage.getItem('colSize')) {
			const colSize = JSON.parse(localStorage.getItem('colSize'))
			table.style.gridTemplateColumns = colSize
		}
		
			num= 0
			id = 0
		totalCalc()
		changeInputs()
	}
// Добавление новой строки в таблицу
$addBtn.addEventListener('click', ()=> {
	
	if (document.documentElement.clientWidth > 767.9) {
		let lastId = 0;
		if ($tableBody.lastElementChild) {
			lastId = +$tableBody.lastElementChild.id
		} 
		const $newTr = createTr(lastId+1, lastId+1)
		$newTr.setAttribute('id', lastId+1)
		$tableBody.append($newTr)
		
		const $dropSearch = $newTr.querySelector('.products__list')
		$dropSearch.addEventListener('click', el => {
			updatePosition(el.target)
			$dropSearch.classList.remove('products__list--active')
		})
	} else {
		const cloneContainer = document.querySelector('.table__clone')
		const $newTr = newTrXS()
		cloneContainer.append($newTr)
		openTR()
	
		const $dropSearch = $newTr.querySelector('.products__list')
		$dropSearch.addEventListener('click', el => {
			updatePosition(el.target)
			$dropSearch.classList.remove('products__list--active')
		})
		
	}
	totalCalc()
	changeInputs()
})
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
	<a href="https://opt6.ru/products/mramornyy_shcheben_fr_5_0_10_0_mm_25kg/" class='link__shop'></a>
		<input class='tr__input-name cell__wrapper'/>
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
	$tdTitle.innerHTML = `
	<div class='label__name'>
	<a href="https://opt6.ru/products/mramornyy_shcheben_fr_5_0_10_0_mm_25kg/" class='link__shop'></a>
	<input class='tr__input-title cell__wrapper' />
	</div>`  
	$tdTotal.innerHTML = `<input class='tr__input-total cell__wrapper' type='number' />`  
	const currentCol = JSON.parse(localStorage.getItem('currentCol'))
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
const newTrXS = ()=> {
	const cloneContainer = document.querySelector('.table__clone')
	let lastId = 0;
	cloneContainer.querySelectorAll('.clone__tr').length === 0 ? lastId : lastId = +cloneContainer.querySelectorAll('.clone__tr')[cloneContainer.querySelectorAll('.clone__tr').length-1].id
	
	const $newTr = document.createElement('div')
	$newTr.classList.add('clone__tr', 'open__tr')
	
	$newTr.setAttribute('id', lastId+1)
	const $tdId = document.createElement('div'),
	$tdAction = document.createElement('div'),
	$tdName = document.createElement('div'),
	$tdPrice = document.createElement('div'),
	$tdQuantity = document.createElement('div'),
	$tdTitle = document.createElement('div'),
	$tdTotal = document.createElement('div')
	$newTr.dataset.cloneTableId = lastId+1;
	$tdId.dataset.cloneTableCol = 1
	$tdAction.dataset.cloneTableCol = 2
	$tdName.dataset.cloneTableCol = 3
	$tdPrice.dataset.cloneTableCol = 4
	$tdQuantity.dataset.cloneTableCol = 5
	$tdTitle.dataset.cloneTableCol = 6
	$tdTotal.dataset.cloneTableCol = 7
	const openTr = document.createElement('button')
	openTr.classList.add('clone__tr-btn')
	openTr.textContent = `закрыть`
	openTr.style.display = 'inline'
	$newTr.append(openTr)
	$tdId.innerHTML = `<div class='clone__col'>
						<p class="name__td">Номер строки</p>
						<div class='tr__id-wrapper '>
							<button class='tr__btn-drag'></button>
							<p class='tr__id' id='${lastId+1}'>${lastId+1}</p>
						</div>`
	$tdAction.innerHTML = `
	<p class="name__td">Действия</p>
	<div class="action__wrapper ">
		<button class='tr__btn-action'></button>
		<button class="delete cell__wrapper">Удалить</button>
	</div>
	</div>`;


	$tdName.innerHTML = `<div class='clone__col'>
	<p class="name__td">Наименование единицы</p>
	<div class='label__name'>
	
		<input class='tr__input-name cell__wrapper'
		/>
		<a href="https://opt6.ru/products/mramornyy_shcheben_fr_5_0_10_0_mm_25kg/" class='link__shop'></a>
		<ul class='products__list products__list--active cell__wrapper'>
			<li class='product__item' id='product1'>${dataBase[0].name}</li>
			<li class='product__item' id='product2'>${dataBase[1].name}</li>
			<li class='product__item' id='product3'>${dataBase[2].name}</li>
			<li class='product__item' id='product4'>${dataBase[3].name}</li>
			<li class='product__item' id='product5'>${dataBase[4].name}</li>
		</ul>
	</div>
	</div>` 
	
	$tdPrice.innerHTML = ` <div class='clone__col'>
	<p class="name__td">Цена</p>
	<input class='tr__input-price cell__wrapper' type='number'  />
	</div>` 
	$tdQuantity.innerHTML = `  <div class='clone__col'>
	 <p class="name__td">Кол-во</p>
	<input class='tr__input-quantity cell__wrapper' type='number'  />
	</div>` 
	$tdTitle.innerHTML = `  <div class='clone__col'>
	 <p class="name__td">Название товара</p>
	 <div class='label__name'>
	
	 <a href="https://opt6.ru/products/mramornyy_shcheben_fr_5_0_10_0_mm_25kg/" class='link__shop'></a>
	<input class='tr__input-title cell__wrapper' />
	</div>
	</div>`  
	$tdTotal.innerHTML = `  <div class='clone__col'>
	 <p class="name__td">Итого</p>
	 <input class='tr__input-total cell__wrapper ' type='number' />

	</div>` 
	const currentCol = JSON.parse(localStorage.getItem('currentCol'))
	const tdArr = [$tdId,$tdAction,$tdName,$tdPrice,$tdQuantity,$tdTitle,$tdTotal]	

	if (currentCol) {
		currentCol.forEach(el => {
			for (let i = 0; i < tdArr.length; i++) {
				if (+el === +tdArr[i].dataset.cloneTableCol) {
					
					$newTr.append(tdArr[i])
				}
			}
		})
	} else {
		$newTr.append($tdId,
			$tdAction,
			$tdName,
			$tdPrice,
			$tdQuantity,
			$tdTitle,
			$tdTotal)
	}
	
	return $newTr

}
// ДЕЙСТВИЯ С ТАБЛИЦЕЙ
// разворачиваем таблицу
const openTR = ()=> {
	const $trsClone = document.querySelectorAll('.clone__tr')
	$trsClone.forEach(el=> {
		el.addEventListener('click', (ev)=> {
	
				if (!el.classList.contains('open__tr')) {
					el.classList.add('open__tr')
					el.querySelector('.clone__tr-btn').style.display = 'inline'
				} else if (ev.target.classList.contains('clone__tr-btn')){
					el.querySelector('.clone__tr-btn').style.display = 'none'
					el.classList.remove('open__tr')
				}
				
		})
	})
}
document.addEventListener('click', (e)=> {
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
				
			$tableBody.querySelectorAll('.table__tr').forEach(item=> {
				if (+item.id === +e.target.parentNode.parentNode.parentNode.getAttribute('id')) {
					item.remove()
				}	
			})
			
		})
		renderCloneTable()
		saveOrders()
		renderTable()
		createCloneTable()
		
	}
	// Изменение полей
	if (e.target.classList.contains('tr__input-name') ) {
		const dropSearch = e.target.nextElementSibling
		dropSearch.addEventListener('click', e => {
			createCloneTable()
			updatePosition(e.target);
		})
	}
})
const renderCloneTable = () => {
const container = document.querySelector('.table__clone')
let id = 1
container.querySelectorAll('.clone__tr').forEach(el=> {
	el.id = id
	id++
})
}
const updatePosition = (elem)=> {
	dataBase.forEach(item=> {
		if (item.id === +elem.id.replace(/[^\d]/g, '')) {
			let tr;
			if (document.documentElement.clientWidth > 767.9) {
				tr = elem.closest('.table__tr')
			} else {
				tr = elem.closest('.clone__tr')

			}
			tr.querySelector('.tr__input-title').value = item.name
			tr.querySelector('.tr__input-quantity').value = item.quantity
			tr.querySelector('.tr__input-price').value = item.price
			tr.querySelector('.tr__input-name').value = `${item.name},${item.weight >=1000 ? item.weight / 1000 + ' тн': item.weight + ' кг'}`
			tr.querySelector('.tr__input-name').dataset.weight =  item.weight
			tr.querySelector('.tr__input-total').value = item.price * item.quantity
		}
	
	})
	changeInputs()
	saveOrders()
	totalCalc()
}
const saveOrders =()=> {
	let countOrders=[];
	if (document.documentElement.clientWidth > 767.9) {
		const items = $tableBody.querySelectorAll('tr')
	
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
	} else {
		const items = document.querySelector('.table__clone').querySelectorAll('.clone__tr')
		
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
	}
	
	localStorage.setItem('order', JSON.stringify(countOrders));
}
const saveColSize = ()=> {
	localStorage.setItem('colSize', JSON.stringify(document.getElementById('table').style.gridTemplateColumns))
	const colSize = JSON.parse(localStorage.getItem('colSize'))
}
$saveBtnChange.addEventListener('click', ev=> {
	saveColSize()
	ev.target.style.display  = 'none'
})
const createCloneTable = ()=>  {
const trs =	$tableBody.querySelectorAll('.table__tr')
const container = document.querySelector('.table__wrapper')
const cloneContainer = document.querySelector('.table__clone')
cloneContainer.innerHTML = ''
container.prepend(cloneContainer)
trs.forEach(tr=> {
	const cloneTr = document.createElement('div')
	const tds = [...tr.childNodes]

tds.forEach(td=> {
	
	const cloneTd = document.createElement('div')
	cloneTr.classList.add('clone__tr')
	cloneTr.setAttribute('id', tr.id)
	cloneTr.dataset.cloneTableId = tr.dataset.tableId
	cloneTd.innerHTML =  td.innerHTML
	const openTr = document.createElement('button')
	openTr.classList.add('clone__tr-btn')
	
	openTr.textContent = `закрыть`
	cloneTr.append(openTr)
	const nameTr = (name, cont)=> {
		const nameCol = document.createElement('p')
		nameCol.textContent = name
		nameCol.classList.add('name__td')
		cont.prepend(nameCol)
	}

	if (cloneTd.firstElementChild.classList.contains('tr__id-wrapper')) {
		cloneTd.dataset.cloneTableCol = td.dataset.tableCol
		cloneTd.classList.add('clone__col')
		nameTr('Номер строки', cloneTd )
	} else 
	if (cloneTd.firstElementChild.classList.contains('action__wrapper')) {
		cloneTd.dataset.cloneTableCol = td.dataset.tableCol
		cloneTd.classList.add('clone__col')
			nameTr('Действия', cloneTd )
	} else 
	if (cloneTd.firstElementChild.classList.contains('label__name')) {
		cloneTd.dataset.cloneTableCol = td.dataset.tableCol
		cloneTd.classList.add('clone__col')
		cloneTd.querySelector('input').value = td.querySelector('input').value
			nameTr('Наименование единицы', cloneTd )

	} else 
	if (cloneTd.firstElementChild.classList.contains('tr__input-price')) {
		cloneTd.dataset.cloneTableCol = td.dataset.tableCol
		cloneTd.classList.add('clone__col')
		cloneTd.firstElementChild.value = td.firstElementChild.value
			nameTr('Цена', cloneTd )
	} else 
	if (cloneTd.firstElementChild.classList.contains('tr__input-quantity')) {
		cloneTd.dataset.cloneTableCol = td.dataset.tableCol
		cloneTd.classList.add('clone__col')
		cloneTd.firstElementChild.value = td.firstElementChild.value
			nameTr('Кол-во', cloneTd )
	} else 
	if (cloneTd.firstElementChild.classList.contains('tr__input-title')) {
		cloneTd.dataset.cloneTableCol = td.dataset.tableCol
		cloneTd.classList.add('clone__col')
		cloneTd.querySelector('input').value = td.querySelector('input').value
			nameTr('Название', cloneTd )
	} else 
	if (cloneTd.firstElementChild.classList.contains('tr__input-total')) {
		cloneTd.dataset.cloneTableCol = td.dataset.tableCol
		cloneTd.classList.add('clone__col')
		cloneTd.firstElementChild.value = td.firstElementChild.value
			nameTr('Итого', cloneTd )
	}
	
	cloneTr.append(cloneTd)

})

cloneContainer.append(cloneTr)
})
openTR()
}

// калькуляция в итоговую таблицу
const totalCalc = ()=> {

	const calc =(cont)=> {
		let totalSum = 0;
		let totalQuantity = 0;
		let totalWeight = 0;
		cont.forEach(el => {
			const test = +el.querySelector('.tr__input-name')
			const totalCellSum = +el.querySelector('.tr__input-total').value
			const totalCellQuan = +el.querySelector('.tr__input-quantity').value
			const totalCellWeight = +el.querySelector('.tr__input-name').dataset.weight
			totalSum = totalSum + totalCellSum 
			totalQuantity = totalQuantity + totalCellQuan 
			totalWeight = totalWeight + totalCellWeight 

	// Итоговая сумма всегда разделяется по разрядам, включая числа с плавающей точкой
	$totalSum.textContent = totalSum.toLocaleString() + ' руб'
	$totalQuantity.textContent = totalQuantity + ' шт'
	$totalWeight.textContent = totalWeight.toLocaleString() + ' кг'
	$totalGlobSum.textContent = totalSum.toLocaleString() + ' руб'
		}	
	)}
	if (document.documentElement.clientWidth > 767.9) {
		const $trs = document.querySelectorAll('.table__tr')
		calc($trs)
	} else {
		const $trs = document.querySelectorAll('.clone__tr')
		calc($trs)
	}
	
}
// изменение значение при изменении ввдных значений в цене и количестве. Остальные значения не стал прописывать в калькуляцию, потому что не до конца понимаю специфику.
// Например не понятно измнение веса. можно ли его менять в номенклатуре( в чем я сомневаюсь), думаю что 25кг это мешки, по тонне это бигбеги.
const changeInputs = ()=> {
	const $trs = document.querySelectorAll('.table__tr')
	const $trsClone = document.querySelectorAll('.clone__tr')

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
			createCloneTable()
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
				totalCalc()
			})
		$inputQuan.addEventListener('input', (e)=> {
				$inputTotal.value = $inputQuan.value * $inputPrice.value
				totalCalc()
				
			})
			$inputName.addEventListener('change', ()=> {
				saveOrders()
				createCloneTable()
				})
			$inputPrice.addEventListener('change', ()=> {
				saveOrders()
				createCloneTable()
				})
			$inputQuan.addEventListener('change', ()=> {
				saveOrders()
				createCloneTable()
				})
			$inputTotal.addEventListener('change', ()=> {
				saveOrders()
				createCloneTable()
				})


		// Решил добавить что бы при изменении инпута менялась стоимость, но не менялось кол-во. 
		// По опыту работы с нерудкой знаю, что иногда есть общая цена и объем/масса, и хочется получить цену за единицу, не залезая в калькулятор
		// Возможно, жто не понадобится на реальном проекте, но на данный момент я увидел такую потребность. даже если такая потребность имеет место, 
		// возможно, логика поведения будет другая
		$inputTotal.addEventListener('input', (e)=> {
			const test = $inputTotal.value / $inputQuan.value
			// про копейки тоже не забываем
			$inputPrice.value = test.toFixed(2)
			totalCalc()
		})
		})
	$trsClone.forEach(el => {
		
	const $inputQuanClone = el.querySelector('.tr__input-quantity')
	const $inputPriceClone = el.querySelector('.tr__input-price')
	const $inputTotalClone = el.querySelector('.tr__input-total')
	const $nameWrapperClone = el.querySelector('.label__name')
	const $inputNameClone = el.querySelector('.tr__input-name')
	
	$inputNameClone.addEventListener('focus', el => {
	
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
	$inputNameClone.addEventListener('blur', el => {
		el.target.nextElementSibling.classList.remove('products__list--active')
		createCloneTable()
		})
	$inputNameClone.addEventListener('input',(el) => {
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
	$inputPriceClone.addEventListener('input', (e)=> {

			$inputTotalClone.value = $inputQuanClone.value * $inputPriceClone.value
			totalCalc()

		})

	$inputQuanClone.addEventListener('input', (e)=> {
			$inputTotalClone.value = $inputQuanClone.value * $inputPriceClone.value
			totalCalc()

		})
		$inputNameClone.addEventListener('change', ()=> {
			renderTable()
			})
		$inputPriceClone.addEventListener('change', ()=> {
			renderTable()
			})
		$inputQuanClone.addEventListener('change', ()=> {
			renderTable()
			})
		$inputTotalClone.addEventListener('change', ()=> {
			renderTable()
			})
	// Решил добавить что бы при изменении инпута менялась стоимость, но не менялось кол-во. 
	// По опыту работы с нерудкой знаю, что иногда есть общая цена и объем/масса, и хочется получить цену за единицу, не залезая в калькулятор
	// Возможно, жто не понадобится на реальном проекте, но на данный момент я увидел такую потребность. даже если такая потребность имеет место, 
	// возможно, логика поведения будет другая
	$inputTotalClone.addEventListener('input', (e)=> {
		const test = $inputTotalClone.value / $inputQuanClone.value
		// про копейки тоже не забываем
		$inputPriceClone.value = test.toFixed(2)
		totalCalc()
	})
	})
		
}
const resizableTable = ()=> {
	const min = 40;
	// The max (fr) values for grid-template-columns
	const columnTypeToRatioMap = {
	  numeric: .5,
	  'text-short': 1.67,
	  'text-long': 3.33};
	
	
	const table = document.querySelector('table');
	
											  
	let columns = [];
	
	let headerBeingResized;
	
	// The next three functions are mouse event callbacks
	
	// Where the magic happens. I.e. when they're actually resizing
	const onMouseMove = e => requestAnimationFrame(() => {
	
	
	  // Calculate the desired width
	  let horizontalScrollOffset = document.documentElement.scrollLeft;
	  const width = horizontalScrollOffset + e.clientX - headerBeingResized.offsetLeft - 265;
	  // Update the column object with the new size value
	  const column = columns.find(({ header }) => header === headerBeingResized);
	  column.size = Math.max(min, width) + 'px'; // Enforce our minimum
	
	
	
	  // For the other headers which don't have a set width, fix it to their computed width
	
	
	  columns.forEach(column => {
		if (column.size.startsWith('minmax')) {// isn't fixed yet (it would be a pixel value otherwise)
		  column.size = parseInt(column.header.clientWidth, 10) + 'px';
		}
	  });
	
	  /* 
			Update the column sizes
			Reminder: grid-template-columns sets the width for all columns in one value
		  */
	  table.style.gridTemplateColumns = columns.
	  map(({ size }) => size).
	  join(' ');
	});
	
	// Clean up event listeners, classes, etc.
	const onMouseUp = () => {
	 
	
	  window.removeEventListener('mousemove', onMouseMove);
	  window.removeEventListener('mouseup', onMouseUp);
	  headerBeingResized.classList.remove('header--being-resized');
	  headerBeingResized = null;
		
		
	  $saveBtnChange.style.display = 'block'
	
	};
	
	// Get ready, they're about to resize
	const initResize = ({ target }) => {
	
	  headerBeingResized = target.parentNode;
	  window.addEventListener('mousemove', onMouseMove);
	  window.addEventListener('mouseup', onMouseUp);
	  headerBeingResized.classList.add('header--being-resized');
	};
	
	// Let's populate that columns array and add listeners to the resize handles
	document.querySelectorAll('th').forEach(header => {
	  const max = columnTypeToRatioMap[header.dataset.type] + 'fr';
	  columns.push({
		header,
		// The initial size value for grid-template-columns:
		size: `minmax(${min}px, ${max})` });
	
	  header.querySelector('.resize-handle').addEventListener('mousedown', initResize);
	});
	}
const dragTableCol = () =>  {

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
		list.style.top = `40px`;
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
		if (!e.target.classList.contains('resize-handle')) {
			draggingColumnIndex = [].slice.call(table.querySelectorAll('th')).indexOf(e.target);

			// Determine the mouse position
			x = e.clientX - e.target.offsetLeft;
			y = e.clientY - e.target.offsetTop;

			// Attach the listeners to `document`
			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);

		}
		
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

	const mouseUpHandler = function (e) {

		
			// // Remove the placeholder
			// placeholder && placeholder.parentNode.removeChild(placeholder);
			// draggingEle.classList.remove('dragging');
			// draggingEle.style.removeProperty('top');
			// draggingEle.style.removeProperty('left');
			// draggingEle.style.removeProperty('position');
			// Get the end index
			const endColumnIndex = [].slice.call(list.children).indexOf(draggingEle);
			let colsSize = table.style.gridTemplateColumns.split(' ').map(el=> el.replace('px', ''))
			
			const currenCol = colsSize[draggingColumnIndex]

		
			function move(val, array) {
				let index = array.indexOf(val);
				array.splice(index, 1)
				array.splice(endColumnIndex, 0, val)
				return array;
			}
			move(currenCol, colsSize)
			const newcolsSize= colsSize.map(el=> el + 'px').join(' ')
			table.style.gridTemplateColumns = newcolsSize
			$saveBtnChange.style.display = 'block'
			
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
		
			
				resizableTable()
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

}
window.addEventListener('resize', ()=> {
	createCloneTable()
	renderTable()
})













document.addEventListener('DOMContentLoaded', function () {

	sortDragableItems()
	renderTable()
	createCloneTable()
	renderTabs()
	totalCalc()
	renderCols()
	changeInputs()

	// Перемещение строк в таблице
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

	// Перемещение строк в верхнем меню
	dragula([document.querySelector('.sort__list')], {
        
        moves: function (el, source, handle, sibling) {
            if (handle.classList.contains('sort__el') ) {
            return true
            } else {
            return false
            }
        }
		
	})
	.on('drop', function () {
		sortTabs()
		renderTabs()

	})
	// Перемещение строк в таблице через выпадающий список
	dragula([document.getElementById('table__sort').querySelector('.sort__list')], {
	
		moves: function (el, source, handle, sibling) {

			if (handle.classList.contains('sort__el') ) {
			return true
			} else {
			return false
			}
		}
		
	})
	.on('drop', function () {
		let cols = []
		const els = [...document.getElementById('table__sort').querySelector('.sort__list').childNodes]
		els.forEach(el=> {
		cols.push(el.dataset.priorityTableTab)
		})
		localStorage.setItem('currentCol', JSON.stringify(cols))
		renderTable()
		createCloneTable()
	})
	// Перемещение строк в таблице на маленьком экране
	dragula([document.querySelector('.table__clone')], {
	
		moves: function (el, source, handle, sibling) {

			if (el.classList.contains('clone__tr') && !handle.classList.contains('clone__tr-btn') ) {
			return true
			} else {
			return false
			}
		}
		
	})
	.on('drop', function () {
		saveOrders()
		createCloneTable()
		renderTable()
		
	})
		resizableTable()
		dragTableCol()
});
