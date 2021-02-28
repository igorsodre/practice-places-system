import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '../../../components/FormElements/Button';
import ImageUpload from '../../../components/FormElements/ImageUpload';
import Input from '../../../components/FormElements/Input';
import ErrorModal from '../../../components/UI/ErrorModal';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import AuthContext from '../../../data/auth-context';
import { PlacesService } from '../../../services/places.service';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../../util/validators';
import './NewPlace.scss';

interface RouteProps {}
interface NewPlaceProps extends RouteComponentProps<RouteProps, {}, {}> {}
interface NewPlaceState {
  inputs: {
    [key: string]: {
      value: string | Nullable<File>;
      isValid: boolean;
    };
  };
  isValid: boolean;
  isLoading: boolean;
  error?: string;
}

class NewPlace extends React.Component<NewPlaceProps, NewPlaceState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;
  constructor(props: NewPlaceProps) {
    super(props);
    this.state = {
      inputs: {
        description: {
          value: '',
          isValid: false,
        },
        title: {
          value: '',
          isValid: false,
        },
        address: {
          value: '',
          isValid: false,
        },
        image: {
          value: null,
          isValid: false,
        },
      },
      isValid: false,
      isLoading: false,
    };
  }

  getFormValidity = (excludeKey: string): boolean => {
    let isValid = true;
    for (let key in this.state.inputs) {
      if (key !== excludeKey) isValid = isValid && this.state.inputs[key].isValid;
    }
    return isValid;
  };

  inputHandler = (id: string, value: any, isValid: boolean) => {
    const formValidity = this.getFormValidity(id);
    this.setState((oldState) => ({
      inputs: { ...oldState.inputs, [id]: { value, isValid } },
      isValid: formValidity && isValid,
    }));
  };

  formSubmithandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const { description, title, address, image } = this.state.inputs;
    try {
      await PlacesService.createPlace(
        String(title.value),
        String(address.value),
        String(description.value),
        image.value as File,
      );
      this.props.history.push('/');
    } catch (err) {
      console.log(err);
    }
    this.setState({ isLoading: false });
  };

  clearError = () => {
    this.setState({ error: '' });
  };

  render = () => {
    return (
      <React.Fragment>
        <ErrorModal error={this.state.error} onClear={this.clearError} />
        <form className="place-form" onSubmit={this.formSubmithandler}>
          {this.state.isLoading && <LoadingSpinner asOverlay />}
          <Input
            element="input"
            id="title"
            type="text"
            label="Title"
            errorText="Please enter a valid title."
            validators={[VALIDATOR_REQUIRE()]}
            onInput={this.inputHandler}
          />
          <Input
            element="textarea"
            id="description"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={this.inputHandler}
          />
          <Input
            element="input"
            id="address"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address."
            onInput={this.inputHandler}
          />
          <ImageUpload id="image" center onInput={this.inputHandler} errorText="Plase provide an image." />
          <Button type="submit" disabled={!this.state.isValid}>
            ADD PLACE
          </Button>
        </form>
      </React.Fragment>
    );
  };
}

export default withRouter(NewPlace);
