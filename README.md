# Modal Components

This directory contains two React modal APIs:

- `Modal.jsx` exports the controlled `ModalBox` component.
- `Confirm.jsx` exports the promise-based `Confirm` helper for one-off confirmation dialogs.

Both components require React 18 or later. `ModalBox` uses `createPortal`, so it must run in a browser where `document.body` is available.

## ModalBox

Import the default export and control its visibility with `open`. Call `handleClose` and `handleOk` from the parent to update state or perform an action.

```jsx
import { useState } from 'react';
import ModalBox from './Modal/Modal';

export default function EditButton() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button onClick={() => setOpen(true)}>Edit</button>

			<ModalBox
				open={open}
				title="Edit profile"
				content={<p>Update your profile details.</p>}
				handleClose={() => setOpen(false)}
				handleOk={() => {
					saveProfile();
					setOpen(false);
				}}
				okText="Save"
				cancelText="Cancel"
			/>
		</>
	);
}
```

### ModalBox props

| Prop | Default | Description |
| --- | --- | --- |
| `open` | `false` | Whether the modal is rendered. |
| `title` | unset | Text shown in the default header. |
| `content` | unset | Modal body content when `children` is not provided. |
| `children` | unset | Body content. A function receives `{ close, ok }`. |
| `header` | `true` | Set to `false` to hide the header, or pass custom header content. |
| `footer` | unset | Custom footer content. A function receives `{ close, ok }`; `null` hides the footer. |
| `handleClose` | no-op | Called by the close button, backdrop, or Escape key. |
| `handleOk` | no-op | Called by the OK button. |
| `okText` | `"Ok"` | OK button label. |
| `cancelText` | `"Cancel"` | Cancel button label. |
| `showOk` | `true` | Whether to show the OK button. |
| `showCancel` | `true` | Whether to show the cancel button. |
| `okDisabled` | `false` | Disables the OK button. |
| `cancelDisabled` | `false` | Disables the cancel button. |
| `loading` | `false` | Shows a spinner and disables the OK button. |
| `okColor` | `"primary"` | OK button color class, such as `primary`, `red`, `green`, or `gray`. |
| `cancelColor` | `"gray"` | Cancel button color class. |
| `size` | `"sm"` | Dialog size: `sm`, `md`, `lg`, or `full`. |
| `closeOnBackdrop` | `true` | Closes when the backdrop is clicked. |
| `closeOnEsc` | `true` | Closes when Escape is pressed. |

### Render custom body content

```jsx
<ModalBox
	open={open}
	title="Details"
	handleClose={() => setOpen(false)}
	footer={null}
>
	<p>This content is rendered as the modal body.</p>
</ModalBox>
```

Function children can use the provided controls:

```jsx
<ModalBox open={open} handleClose={() => setOpen(false)}>
	{({ close, ok }) => (
		<form onSubmit={(event) => { event.preventDefault(); ok(); }}>
			<input name="name" />
			<button type="button" onClick={close}>Close</button>
			<button type="submit">Save</button>
		</form>
	)}
</ModalBox>
```

## Confirm

`Confirm` creates and removes a modal automatically. It returns a promise that resolves to `true` when the OK action is selected and `false` when the dialog is closed or cancelled.

In this repository layout, import the helper from `./Modal/Confirm`. The `Confirm.jsx` source currently imports `ModalBox` from `../components/Modal`; update that import to the actual location, for example `./Modal`, when using these files directly from this directory.

```jsx
import { Confirm } from './Modal/Confirm';

async function deleteItem() {
	const confirmed = await Confirm({
		title: 'Delete item?',
		content: 'This cannot be undone.',
		okText: 'Delete',
		okColor: 'red',
	});

	if (confirmed) {
		await removeItem();
	}
}
```

### Confirm options

`Confirm` accepts `title`, `content`, `okText`, `cancelText`, `okColor`, and `cancelColor`. Any additional options are forwarded to `ModalBox`, so modal options such as `size`, `closeOnBackdrop`, `closeOnEsc`, `showCancel`, and `loading` can also be supplied.

```jsx
const confirmed = await Confirm({
	title: 'Publish changes?',
	content: 'Your changes will become visible immediately.',
	okText: 'Publish',
	okColor: 'green',
	size: 'md',
	closeOnEsc: false,
});
```

`Confirm` appends its own container to `document.body`, so call it only in browser code, such as an event handler or client-side effect. Always `await` or otherwise handle the returned promise before continuing the action.
