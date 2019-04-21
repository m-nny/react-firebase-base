import React from 'react';
import { compose } from 'recompose';

import withAuthorization, { Condition } from '../Session/withAuthorization';
import { withAuthentication, withEmailVerification } from '../Session';
import { WithFirebase, withFirebase } from '../Firebase';
import Message from '../../models/Message';
import { WithAuthentication } from '../Session/withAuthentication';

const Home: React.FC = () => (
	<div>
		<h1>Home</h1>
		<p>The Home Page is accessible by every signed in user.</p>

		<Messages/>
	</div>
);

type MessagesProps = WithFirebase & WithAuthentication;
type MessagesState = { loading: boolean, messages: Message[] | null, text: string };
type RemoveMessageHandler = (message_uid: string) => void;
type EditMessageHandler = (message: Message, text: string) => void;

class MessagesBase extends React.Component<MessagesProps, MessagesState> {
	readonly state: MessagesState = {loading: false, messages: [], text: ''};

	render() {
		const {text, messages, loading} = this.state;
		return (
			<div>
				{loading && <div>Loading ...</div>}
				{messages ? (
					<MessageList
						messages={messages}
						onRemoveMessage={this.onRemoveMessage}
						onEditMessage={this.onEditMessage}
					/>
				) : (
					<div>There are no messages...</div>
				)}
				<form onSubmit={this.onCreateMessage}>
					<input
						type="text"
						name="text"
						value={text}
						onChange={this.onChangeText}
					/>
					<button type="submit">Send</button>
				</form>
			</div>
		)
	}

	componentDidMount(): void {
		this.setState({loading: true});

		this.props.firebase.messages().on('value', snapshot => {
			const messageObject = snapshot!.val();

			if (messageObject) {
				const messageList: Message[] = Object.keys(messageObject).map(key => ({
					...messageObject[key],
					uid: key
				}));

				this.setState({messages: messageList, loading: false});
			} else {
				this.setState({messages: null, loading: false});
			}
		});
	}

	componentWillUnmount(): void {
		this.props.firebase.messages().off();
	}

	onChangeText: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
		this.setState({[name]: value} as any);
	};

	onCreateMessage: React.FormEventHandler = (event) => {
		this.props.firebase.messages().push({
			text: this.state.text,
			userId: this.props.userInfo!.uid,
			createdAt: this.props.firebase.serverValue.TIMESTAMP,
		});

		this.setState({text: ''});

		event.preventDefault();
	};

	onRemoveMessage: RemoveMessageHandler = (message_uid) => {
		this.props.firebase.message(message_uid).remove();
	};

	onEditMessage: EditMessageHandler = (message, text) => {
		const {uid, ...messageSnapshot} = message;
		this.props.firebase.message(uid).set({
			...messageSnapshot,
			text,
			editedAt: this.props.firebase.serverValue.TIMESTAMP,
		});
	};
}

type MessageListProps = { messages: Message[], onRemoveMessage: RemoveMessageHandler, onEditMessage: EditMessageHandler };
type MessageItemProps = { message: Message, onRemoveMessage: RemoveMessageHandler, onEditMessage: EditMessageHandler };
type MessageItemState = { editMode: boolean, editText: string };

const MessageList: React.FC<MessageListProps> = ({messages, onRemoveMessage, onEditMessage}) => (
	<ul>
		{messages.map(message => (
			<MessageItem
				key={message.uid}
				message={message}
				onRemoveMessage={onRemoveMessage}
				onEditMessage={onEditMessage}
			/>
		))}
	</ul>
);

class MessageItem extends React.Component<MessageItemProps, MessageItemState> {
	readonly state: MessageItemState = {editMode: false, editText: this.props.message.text};

	render() {
		const {message, onRemoveMessage} = this.props;
		const {editMode, editText} = this.state;

		return (
			<li>
				{editMode ? (
					<input
						type="text"
						value={editText}
						onChange={this.onChangeEditText}
					/>
				) : (
					<span>
						<strong>{message.userId}</strong> {message.text}
						{message.editedAt && <span>(Edited)</span>}
					</span>
				)}
				{editMode ? (
					<span>
						<button onClick={this.onSaveEditText}>Save</button>
						<button onClick={this.onToggleEditMode}>Reset</button>
					</span>
				) : (
					<button onClick={this.onToggleEditMode}>Edit</button>
				)}

				{!editMode && <button
					type="button"
					onClick={() => onRemoveMessage(message.uid)}
				>
					Delete
				</button>
				}
			</li>
		);
	}

	onToggleEditMode = () => {
		this.setState(state => ({
			editMode: !state.editMode,
			editText: this.props.message.text,
		}))
	};

	onChangeEditText: React.ChangeEventHandler<HTMLInputElement> = event => {
		this.setState({editText: event.target.value});
	};

	onSaveEditText = () => {
		this.props.onEditMessage(this.props.message, this.state.editText);

		this.setState({editMode: false});
	}
}

const Messages = compose<MessagesProps, {}>(
	withAuthentication,
	withFirebase,
)(MessagesBase);

const condition: Condition = userInfo => !!userInfo;

export default compose(
	withEmailVerification,
	withAuthorization(condition),
)(Home);
