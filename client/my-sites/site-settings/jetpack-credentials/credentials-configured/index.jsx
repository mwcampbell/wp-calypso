/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import Gridicon from 'gridicons';
import FoldableCard from 'components/foldable-card';
import CompactCard from 'components/card/compact';
import RewindCredentialsForm from 'components/rewind-credentials-form';
import Button from 'components/button';
import { deleteCredentials } from 'state/jetpack/credentials/actions';
import { getRewindState } from 'state/selectors';

class CredentialsConfigured extends Component {
	componentWillMount() {
		this.setState( { isRevoking: false } );
	}

	handleRevoke = () => this.props.deleteCredentials( this.props.siteId, 'main' );

	toggleRevoking = () => this.setState( { isRevoking: ! this.state.isRevoking } );

	render() {
		const { canAutoconfigure, siteId, translate } = this.props;

		const isRevoking = this.state.isRevoking;

		if ( isRevoking ) {
			return (
				<CompactCard className="credentials-configured">
					<p>
						{ translate(
							"Your site's server was automatically connected to Jetpack to " +
								'perform backups, rewinds, and security scans. You do not have to ' +
								'configure anything further, but you may revoke the credentials if necessary.'
						) }
					</p>
					<div className="credentials-configured__revoke-actions">
						<Button
							className="credentials-configured__revoke-button"
							borderless={ true }
							onClick={ this.handleRevoke }
							scary={ true }
						>
							<Gridicon
								className="credentials-configured__revoke-icon"
								icon="link-break"
								size={ 18 }
							/>
							{ translate( 'Revoke credentials' ) }
						</Button>
						<Button primary onClick={ this.toggleRevoking }>
							{ translate( 'Stay connected' ) }
						</Button>
					</div>
				</CompactCard>
			);
		}

		if ( canAutoconfigure ) {
			return (
				<CompactCard className="credentials-configured" onClick={ this.toggleRevoking } href="#">
					<Gridicon
						icon="checkmark-circle"
						size={ 48 }
						className="credentials-configured__header-gridicon"
					/>
					<div className="credentials-configured__header-configured-text">
						{ translate( 'Backups and security scans are configured and active.' ) }
					</div>
				</CompactCard>
			);
		}

		const header = (
			<div className="credentials-configured__header">
				<Gridicon
					icon="checkmark-circle"
					size={ 48 }
					className="credentials-configured__header-gridicon"
				/>
				<div className="credentials-configured__header-text">
					<h3 className="credentials-configured__header-protocol">{ translate( 'Connected' ) }</h3>
					<h4 className="credentials-configured__header-description">
						{ translate(
							'Your site is being backed up in real time and regularly scanned for security threats.'
						) }
					</h4>
				</div>
			</div>
		);

		return (
			<FoldableCard header={ header } className="credentials-configured">
				<RewindCredentialsForm
					{ ...{
						role: 'main',
						siteId,
						allowCancel: false,
						allowDelete: true,
					} }
				/>
			</FoldableCard>
		);
	}
}

const mapStateToProps = ( state, { siteId } ) => {
	const { canAutoconfigure, credentials = [] } = getRewindState( state, siteId );

	return {
		canAutoconfigure: canAutoconfigure || credentials.some( c => c.type === 'auto' ), // eslint-disable-line wpcalypso/redux-no-bound-selectors,max-len
		mainCredentials: find( credentials, { role: 'main' } ),
	};
};

export default connect( mapStateToProps, { deleteCredentials } )(
	localize( CredentialsConfigured )
);
