import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/magic';

import CurrentImage from './CurrentImage/CurrentImage';
import Cardslist from './Cardslist/Cardslist';
import CurrentSelected from './Cardslist/CurrentSelected';
import CurrentCardInfo from './Cardslist/CurrentCardInfo';

import DeckBuilding from './DeckBuilding/DeckBuilding';

import Colors from './Filters/Colors';
import Creatures from './Filters/Creatures';
import Keywords from './Filters/Keywords';
import Rarity from './Filters/Rarity';
import Sets from './Filters/Sets';
import Special from './Filters/Special';
import Types from './Filters/Types'

import styles from './Magic.css';

class Magic extends Component {

	constructor(props) {
		super(props);
		//filter refs
		this.selectBox = React.createRef();
		this.inputBox = React.createRef();
		this.colorBox = React.createRef();
		this.rarityBox = React.createRef();
		this.setBox = React.createRef();
		this.keywordBox = React.createRef();
		this.specialBox = React.createRef();

		//deckbuilding refs
		this.selectDeck = React.createRef();
		this.inputDeck = React.createRef();
	}

	componentDidMount() {

		const cb = () => {
			console.log('component did mount finished...')
		}
		console.log('component did mount')
		this.props.getDecksFromDB(cb);
	}

	// componentDidUpdate() {
	//
	// 	const cb = () => {
	// 		console.log('component did update finished...')
	// 	}
	//
	// 	this.props.getDecksFromDB(cb);
	// }

	// //leave this in temporarily to check performance
	// shouldComponentUpdate(nextProps, nextState) {
	// 	console.log('shouldComponentUpdate: nextProps: ', nextProps);
	// 	console.log('shouldComponentUpdate: nextState: ', nextState);
	//
	// 	return true;
	// }

	// handleDeckInput = (event) => {
	// 	this.setState({ inputValueDeck: event.target.value})
	// }

	handleDeckNameSubmit = (event, value) => {
		console.log('handleDeckNameSubmit in Magic: ', event, value);

		const cb = () => {
			event.preventDefault();

			this.forceUpdate(()=>{
			});
		};
		this.props.storeDeckName(value, cb)
	}

	//TODO add deckModify to select function in deckbuilding send in null, and maybe add deck to parameters
	deckModify = (card, sign) => { //TODO add parameter newDeck after sign
		console.log('card, sign in deckModify:  ', card, sign);

		const cb = () => {
			this.forceUpdate();
			console.log('deckModify completed...')
		}
		console.log('inputBox value: ', this.inputBox.current.value);
		console.log('##################################################');

		let deck = this.props.currentDeck; //TODO possibly change this to add an || newDeck
		if(card && card.name==="There are no cards with these given filters") return;
		if(sign==='reset') {
			console.log('value of input ref in magic: ', this.inputDeck.current.value);
			this.inputDeck.current.value = '';
			// forceUpdate();
			console.log('value after reset: ', this.inputDeck.current.value)
		}
		this.props.modifyDeck(card, deck, sign, cb);

	}

	saveDeck = () => {
		this.props.saveDeckToDB({
			deck_name: this.props.currentDeckName,
			deck: this.props.currentDeck
		})
	}

	handleClickColumnTwo = () => {
		this.props.setColumnTwo(this.props.columnTwo);
	}

	handleFilter = (event, filterType) => {
		const filterValue = event.target.value;

		const cb = () => {
			this.forceUpdate(()=>{
				this.updateCards();
				this.props.changeCurrentCard(this.props.cards[0]);
			});
		};

		switch(filterType) {
			case 'text':
				this.props.storeFilterText(filterValue, cb);
				break;
			case 'type':
				this.props.storeType(filterValue, cb);
				break;
			case 'colors':
				this.props.storeColor(filterValue, cb);
				break;
			case 'rarity':
				this.props.storeRarity(filterValue, cb);
				break;
			case 'set':
				this.props.storeSet(filterValue, cb);
				break;
			case 'creature':
				this.props.storeCreature(filterValue, cb);
				break;
			case 'keyword':
				this.props.storeKeyword(filterValue, cb);
				break;
			case 'special':
				this.props.storeSpecial(filterValue, cb);
				break;
			default:
				break;
		}
	}

	handleHover = (cardId) => {

		let card = this.props.cards.filter(obj => {
			return obj.id === cardId;
		});

		this.props.changeCurrentCard(card[0]);
	}

	handleDeckHover = (card) => {
		this.props.setColumnTwo(false);
		this.props.changeCurrentCard(card);
	}

	reset = () => {

		const cb = () => {
			this.forceUpdate(()=>{
				this.setState({ columnTwo: false });
				this.updateCards();
			});
		};

		// reset form elements
		this.inputBox.current.value = '';
		this.selectBox.current.value = 'All';
		this.colorBox.current.value = 'All';
		this.rarityBox.current.value = 'All';
		this.setBox.current.value = 'All';
		this.keywordBox.current.value = 'keywords (all)';
		this.specialBox.current.value = 'All Special';


		// send in default values to state
		this.props.storeFilterText('', cb);
		this.props.storeType('All', cb);
		this.props.storeCreature('All Creatures', cb);
		this.props.storeColor('All', cb);
		this.props.storeRarity('All', cb);
		this.props.storeSet('All', cb);
		this.props.storeKeyword('keywords (all)', cb);
		this.props.storeSpecial('All Special', cb);
	}

	//this is for testing calls to the backend to load cards from there. ulitimately going to move to this
	test = () => {
		const cb = () => {
			this.forceUpdate(()=>{
				// this.updateCards();
				console.log('TEST CALL FINISHED');
				console.log('AFTER TEST CALL PROPS: ', this.props);
			});
		};

		let filters = {
			set: this.props.filterSet,
			type: this.props.filterType,
			colors: this.props.filterColor,
			rarity: this.props.filterRarity
		}

		this.props.getCardsFromDatabase(filters, cb)
	}

	updateCards = () => {
		const cb = () => {
			this.forceUpdate(()=>{
				this.props.changeCurrentCard(this.props.cards[0]);
			});
		};

		let filters = {
			set: this.props.filterSet,
			type: this.props.filterType,
			text: this.props.filterText,
			color: this.props.filterColor,
			rarity: this.props.filterRarity,
			creature: this.props.filterCreature,
			keyword: this.props.filterKeyword,
			special: this.props.filterSpecial
		}

		this.props.getcards(filters, cb);
	}

	render() {
		console.log('this.props in Magic.js: ', this.props);
		if (this.props.authenticated) {
		return (
			<div>
				<br />
				<div className={styles.magicPageContainer}>
					<header className={styles.control_bar}>
						<div className={styles.title}>Filters</div>
						<div className={styles.filters}>
							<button id="magicButton" className={styles.button} onClick={()=>this.reset()}>Reset</button>
						</div>
						{/* dont get rid of the following!!!! */}
						{/* <div className={styles.filters}>
							<button id="testCardsButton" className={styles.button} onClick={()=>this.test()}>Test Get Cards</button>
						</div> */}
						<div className={styles.filters}>
							<input className={styles.input} placeholder="type to filter" onChange={(event)=>this.handleFilter(event, 'text')} ref={this.inputBox}/>
						</div>
						<div className={styles.filters}>
							<Types handleFilter={this.handleFilter} ref={this.selectBox}/>
						</div>
						{this.props.filterType==='Creature' ? <div className={styles.filters}><Creatures handleFilter={this.handleFilter} /></div> : null }
						<div className={styles.filters}>
							<Colors handleFilter={this.handleFilter} ref={this.colorBox}/>
						</div>
						<div className={styles.filters}>
							<Rarity handleFilter={this.handleFilter} ref={this.rarityBox} />
						</div>
						<div className={styles.filters}>
							<Sets handleFilter={this.handleFilter} ref={this.setBox} />
						</div>
						<div className={styles.filters}>
							<Keywords handleFilter={this.handleFilter} ref={this.keywordBox}/>
						</div>
						<div className={styles.filters}>
							<Special handleFilter={this.handleFilter} ref={this.specialBox}/>
						</div>
					</header>

					<div className={styles.magicOuterContainer}>
						<div className={styles.col}>
							<CurrentImage currentCard={this.props.currentCard} />
						</div>
						<div className={[styles.col, styles.col2].join(' ')}>
							<CurrentSelected currentSelected={this.props.currentCard} deckModify={this.deckModify} />
							<br />
							{this.props.columnTwo
								? <CurrentCardInfo card={this.props.currentCard} handleClick={this.handleClickColumnTwo} /> :
									<Cardslist cards={this.props.cards} handleHover={this.handleHover} handleClick={this.handleClickColumnTwo} currentCard={this.props.currentCard}/>
							}

						</div>
						<div className={[styles.col, styles.col3].join(' ')}>
							<DeckBuilding
								deck={this.props.currentDeck}
								decks={this.props.decks}
								deckName={this.props.currentDeckName}
								saveDeck={this.saveDeck}
								handleDeckNameSubmit={this.handleDeckNameSubmit}
								handleHover={this.handleDeckHover}
								deckModify={this.deckModify}
								ref={{ refSelect: this.selectDeck, refInput: this.inputDeck }}
								// resetDeck={this.resetDeck}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	} else {
		return <div>You need to be signed in to see this page!</div>
	}
	}
}

function mapStateToProps(state) {
	console.log('state in cards: ', state);
	// console.log('state.cards.cards: ', state.cards.cards);
	return {
		cards: state.cards.cards,
		columnTwo: state.columnTwo.columnTwo,
		currentCard: state.currentCard.currentCard,
		currentDeckName: state.currentDeck.name,
		// currentDeckName: state.currentDeck.name,
		decks: state.decks.decks,
		currentDeck: state.currentDeck.currentDeck,
		filterType: state.cardFilters.filterType,
		filterCreature: state.cardFilters.filterCreature,
		filterKeyword: state.cardFilters.filterKeyword,
		filterText: state.cardFilters.filterText,
		filterColor: state.cardFilters.filterColor,
		filterRarity: state.cardFilters.filterRarity,
		filterSet: state.cardFilters.filterSet,
		filterSpecial: state.cardFilters.filterSpecial,
		testCards: state.testCards,
		authenticated: state.auth.authenticated,
		user: state.auth.user

	};
}

export default connect(mapStateToProps, actions)(Magic);
