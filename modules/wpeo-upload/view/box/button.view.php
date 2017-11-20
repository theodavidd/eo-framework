<?php
/**
 * The button for upload media.
 *
 * @author Eoxia
 * @since 0.1.0-alpha
 * @version 1.0.0
 * @copyright 2017
 * @package EO-Framework/EO-Upload
 */

namespace eoxia;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} ?>

<span data-id="<?php echo esc_attr( $element->id ); ?>"
			<?php echo WPEO_Upload_Class::g()->out_all_attributes( $atts ); // WPCS: XSS is ok. ?>
			data-nonce="<?php echo esc_attr( wp_create_nonce( $nonce_name ) ); ?>"
			class="media <?php if ( empty( $main_picture_id ) ) : ?>no-file <?php endif; ?><?php echo esc_attr( $atts['custom_class'] ); ?>">
	<i class="add animated fa fa-plus-circle"></i>

	<?php
	if ( ! empty( $main_picture_id ) ) :
		if ( '' === $atts['mime_type'] ) :
			echo wp_get_attachment_image( $main_picture_id, $atts['size'] );
		else :
			?>
			<i class="fa fa-paperclip" aria-hidden="true"></i>
			<?php
		endif;
	else :
		if ( '' === $atts['mime_type'] ) :
			?>
			<i class="default-image fa fa-picture-o"></i>
			<?php
		else :
			?>
			<i class="fa fa-paperclip" aria-hidden="true"></i>
			<?php
		endif;
		?>
		<img src="" class="hidden"/>
		<input type="hidden" name="<?php echo esc_attr( $atts['field_name'] ); ?>" />
		&nbsp;
	<?php endif; ?>
</span>
