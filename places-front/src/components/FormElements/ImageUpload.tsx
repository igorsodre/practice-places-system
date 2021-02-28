import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import './ImageUpload.scss';

interface ImageUploadProps {
	id: string;
	center?: boolean;
	onInput?: (arg0: string, arg1: Nullable<File>, arg2: boolean) => void;
	errorText?: string;
}
const ImageUpload: React.FC<ImageUploadProps> = (props) => {
	const [file, setFile] = useState<Nullable<File>>(null);
	const [previewUrl, setPreviewUrl] = useState('');
	const [isValid, setIsValid] = useState(false);

	const filePickerRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!file) return;
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(String(fileReader.result));
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	const pickedhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		let pickedFile: Nullable<File>;
		let fileValid = isValid;
		if (event.currentTarget.files && event.currentTarget.files.length === 1) {
			pickedFile = event.currentTarget.files.item(0);
			fileValid = true;
			setIsValid(true);
			setFile(pickedFile);
		} else {
			setIsValid(false);
			fileValid = false;
		}
		props.onInput && props.onInput(props.id, pickedFile, fileValid);
	};

	const pickImageHandler = () => {
		filePickerRef.current?.click();
	};
	return (
		<div className='form-control'>
			<input ref={filePickerRef} onChange={pickedhandler} style={{ display: 'none' }} type='file' id={props.id} accept='.jpg,.png,.jpeg' />
			<div className={`image-upload ${props.center && 'center'}`}>
				<div className='image-upload__preview'>
					{previewUrl && <img src={previewUrl} alt='Preview' />}
					{!previewUrl && <p>Please pick an image.</p>}
				</div>
				<Button type='button' onClick={pickImageHandler}>
					PICK IMAGE
				</Button>
			</div>
			{!isValid && <p>{props.errorText}</p>}
		</div>
	);
};

export default ImageUpload;
