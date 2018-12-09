import React from 'react';
import Button from '@material-ui/core/Button';

export const Login = (props) => {
    return (
        <div>
            <label htmlFor="">Email</label>
            <input type="text" onChage={event => props.setData(event.target.value, 'email')}  />
            <label htmlFor="">Password</label>
            <input type="text" onChage={event => props.setData(event.target.value, 'password')} />
            <Button onClick={() => this.login(props.email, props.password)}>Login</Button>
        </div>
    );
};

export const SignUp = props => {
    return (<div>
                <label htmlFor="">Name</label>
                <input type="text" onChage={event => props.setData(event.target.value, 'name')} />
                <label htmlFor="">Email</label>
                <input type="text" onChage={event => props.setData(event.target.value, 'email')} />
                <label htmlFor="">Password</label>
                <input type="text" onChage={event => props.setData(event.target.value, 'password')} />
                <label htmlFor="">Password Confirmation</label>
                <input type="text" onChage={event => props.setData(event.target.value, 'password_confirmation')} />
                <Button color={'primary'} onClick = {
                    () => props.registerAccount(props.name, props.email, props.password)
                }>sign up</Button>
        </div>);
};

