<?php
/**
 * The actions button for the gallery.
 *
 * @author Eoxia
 * @since 1.0.0
 * @version 1.0.0
 * @copyright 2017
 * @package EO-Framework/WPEO-Upload
 */

namespace eoxia;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} ?>

<ul class="action">
	<?php if ( 'false' === $data['single'] ) : ?>
		<li>
			<a 	href="#"
					data-action="eo_upload_set_thumbnail"
					data-loader="modal-content"
					data-nonce="<?php echo esc_attr( wp_create_nonce( 'set_thumbnail' ) ); ?>"
					<?php echo WPEO_Upload_Class::g()->out_all_attributes( $data ); // WPCS: XSS is ok. ?>
					data-file-id="<?php echo esc_attr( $main_picture_id ); ?>"
					class="edit-thumbnail-id action-attribute featured-thumbnail"><i class="icon fa fa-star"></i></a>
		</li>
	<?php endif; ?>
	<li>
		<a class="edit-link" target="_blank" href="<?php echo esc_attr( admin_url( 'upload.php?item=' . $main_picture_id . '&mode=edit' ) ); ?>"><i class="icon fa fa-pencil"></i></a>
	</li>
	<li>
		<a 	href="#"
				data-loader="modal-content"
				data-nonce="<?php echo esc_attr( wp_create_nonce( 'dissociate_file' ) ); ?>"
				data-action="eo_upload_dissociate_file"
				<?php echo WPEO_Upload_Class::g()->out_all_attributes( $data ); // WPCS: XSS is ok. ?>
				data-file-id="<?php echo esc_attr( $main_picture_id ); ?>"
				class="edit-thumbnail-id action-attribute dissociate-thumbnail" ><i class="icon fa fa-chain-broken"></i></a>
	</li>
</ul>
