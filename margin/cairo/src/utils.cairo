use alexandria_math::{BitShift, U256BitShift};

// convert a byte array to felt252, assume that the byte array consist only one single felt252
// Will be truncated if the byte array is larger than 1 felt252
pub fn byte_array_to_felt252(byte_array: ByteArray) -> felt252 {
    if byte_array.len() >= 32 {
        panic!("Byte array is too long to convert to felt252");
    }
    let mut result: u256 = 0;
    for i in 0..byte_array.len() {
        let byte = byte_array[i];
        let byte_u256: u256 = byte.into();
        // Shift the byte to the left by (byte_array.len() - i - 1) * 8 bits
        // and add it to the result
        result += BitShift::shl(byte_u256, ((byte_array.len() - i - 1) * 8).into());
    };
    result.try_into().unwrap()
}

mod tests {
    use super::*;

    #[test]
    fn test_byte_array_to_felt252() {
        let byte_array: ByteArray = "ETH";
        let result = byte_array_to_felt252(byte_array);
        assert_eq!(result, 'ETH');

        let byte_array: ByteArray = "STRK";
        let result = byte_array_to_felt252(byte_array);
        assert_eq!(result, 'STRK');

        let byte_array: ByteArray = "ETH/STRK";
        let result = byte_array_to_felt252(byte_array);
        assert_eq!(result, 'ETH/STRK');
    }
}
